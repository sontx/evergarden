import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Story } from "./story.entity";
import {
  CreateStoryDto,
  GetStoryDto,
  PaginationResult,
  randomNumberString,
  stringToSlug,
  UpdateStoryDto,
} from "@evergarden/shared";
import { AuthorService } from "../author/author.service";
import { GenreService } from "../genre/genre.service";
import { UserService } from "../user/user.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { StoryUpdatedEvent } from "../events/story-updated.event";
import { StoryDeletedEvent } from "../events/story-deleted.event";
import { StoryCreatedEvent } from "../events/story-created.event";
import { Pageable } from "../common/pageable";

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    private authorService: AuthorService,
    private genreService: GenreService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAll() {
    return await this.storyRepository.find();
  }

  search(text: string, limit: number): Promise<Story[]> {
    return this.storyRepository
      .createQueryBuilder("story")
      .where("LOWER(story.title) LIKE :title", { title: `%${text.trim().toLowerCase()}%` })
      .limit(limit)
      .getMany();
  }

  async getStoriesByIds(ids: number[]): Promise<GetStoryDto[]> {
    const stories = await this.storyRepository.findByIds(ids);
    return stories.map(StoryService.toDto);
  }

  async getStories(
    pageable: Pageable,
    findOption?: FindManyOptions<Story>,
    includeUnpublished?: boolean,
  ): Promise<PaginationResult<GetStoryDto> | GetStoryDto[]> {
    const { where = {}, ...rest } = findOption || ({} as any);
    const findOptions: FindManyOptions<Story> = {
      ...rest,
      where: includeUnpublished ? where : { published: true, ...where },
      take: pageable.limit,
      skip: pageable.skip,
    };

    if (pageable.needPaging) {
      const result = await this.storyRepository.findAndCount(findOptions);
      return pageable.toPaginationResult(result, StoryService.toDto);
    }

    const result = await this.storyRepository.find(findOptions);
    return result.map(StoryService.toDto);
  }

  async getStoriesByGenres(genres: number[], options: Pageable, includeUnpublished?: boolean) {
    return this.getStoriesByJoin(genres, "genres", options, includeUnpublished);
  }

  async getStoriesByAuthors(authors: number[], options: Pageable, includeUnpublished?: boolean) {
    return this.getStoriesByJoin(authors, "authors", options, includeUnpublished);
  }

  private async getStoriesByJoin(
    joinIds: number[],
    joinTable: "genres" | "authors",
    pageable: Pageable,
    includeUnpublished?: boolean,
  ) {
    let query = this.storyRepository
      .createQueryBuilder("story")
      .innerJoin(`story.${joinTable}`, joinTable)
      .take(pageable.limit)
      .skip(pageable.skip)
      .orderBy("story.updated", "DESC");
    query = includeUnpublished
      ? query.where(`story.published = 1 and ${joinTable}.id in (:...joinIds)`, { joinIds })
      : query.where(`${joinTable}.id in (:...joinIds)`, { joinIds });
    if (pageable.needPaging) {
      const result = await query.getManyAndCount();
      return pageable.toPaginationResult(result, StoryService.toDto);
    }
    return await query.getMany();
  }

  async getNewStories(pageable: Pageable, includeUnpublished?: boolean) {
    return this.getStories(
      pageable,
      {
        order: { created: "DESC" },
      },
      includeUnpublished,
    );
  }

  async getLastUpdatedStories(pageable: Pageable, includeUnpublished?: boolean) {
    return this.getStories(
      pageable,
      {
        order: { updated: "DESC" },
      },
      includeUnpublished,
    );
  }

  async getUserStories(userId: number, pageable: Pageable) {
    return await this.getStories(
      pageable,
      {
        where: { createdBy: userId },
        order: { updated: "DESC" },
      },
      true,
    );
  }

  static toDto(story: Story): GetStoryDto {
    return (
      story && {
        ...story,
        createdBy: UserService.toDto(story.createdBy),
        updatedBy: UserService.toDto(story.updatedBy),
      }
    );
  }

  async addStory(story: CreateStoryDto, userId: number): Promise<GetStoryDto> {
    const slug = await this.getUniqueStorySlug(story);
    const user = await this.userService.getById(userId);

    return await this.storyRepository.manager.transaction(async (entityManager) => {
      story.authors = await this.authorService.syncAuthors(story.authors || [], entityManager);
      story.genres = await this.genreService.getValidGenres(story.genres || [], entityManager);

      const now = new Date();
      const savedStory = await entityManager.save(Story, {
        ...story,
        slug,
        created: now,
        updated: now,
        createdBy: user,
        updatedBy: user,
        view: 0,
        lastChapter: 0,
        upvote: 0,
        downvote: 0,
      });
      this.eventEmitter.emitAsync(StoryCreatedEvent.name, new StoryCreatedEvent(savedStory)).then();
      return StoryService.toDto(savedStory);
    });
  }

  private async getUniqueStorySlug(story: CreateStoryDto) {
    if (story.slug) {
      const found = await this.getStoryByUrl(story.slug);
      if (found) {
        throw new BadRequestException(`Duplicated story slug: ${story.slug}`);
      }
      return story.slug;
    }

    const generatedSlug = stringToSlug(story.title);
    let checkSlug = generatedSlug;
    while (true) {
      const found = await this.storyRepository.findOne({ where: { slug: checkSlug }, loadEagerRelations: false });
      if (found) {
        checkSlug = `${generatedSlug}-${randomNumberString(4)}`;
      } else {
        return checkSlug;
      }
    }
  }

  async updateStory(currentStory: Story, updateStory: UpdateStoryDto, userId: number): Promise<Story> {
    const user = await this.userService.getById(userId);

    return await this.storyRepository.manager.transaction(async (entityManager) => {
      const authors = await this.authorService.syncAuthors(updateStory.authors || [], entityManager);
      const genres = await this.genreService.getValidGenres(updateStory.genres || [], entityManager);

      const updatedStory = await entityManager.save(Story, {
        ...updateStory,
        id: currentStory.id,
        authors,
        genres,
        updated: new Date(),
        updatedBy: user,
      });

      this.eventEmitter.emitAsync(StoryUpdatedEvent.name, new StoryUpdatedEvent(updatedStory)).then();

      return updatedStory;
    });
  }

  async getStoryByUrl(slug: string): Promise<Story | null> {
    return await this.storyRepository.findOne({
      where: { slug },
    });
  }

  async getStory(id: number): Promise<Story | null> {
    return await this.storyRepository.findOne(id);
  }

  async deleteStory(storyId: number): Promise<void> {
    await this.storyRepository.delete(storyId);
    this.eventEmitter.emitAsync(StoryDeletedEvent.name, new StoryDeletedEvent(storyId)).then();
  }
}
