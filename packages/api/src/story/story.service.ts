import { BadRequestException, forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
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
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { StoryUpdatedEvent } from "../events/story-updated.event";
import { StoryDeletedEvent } from "../events/story-deleted.event";
import { StoryCreatedEvent } from "../events/story-created.event";
import { Pageable } from "../common/pageable";

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

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
    if (story.url) {
      const found = await this.getStoryByUrl(story.url);
      if (found) {
        throw new BadRequestException(`Duplicated story url: ${story.url}`);
      }
    } else {
      let newUrl = stringToSlug(story.title);
      try {
        const found = await this.getStoryByUrl(newUrl);
        if (found) {
          newUrl = `${newUrl}-${randomNumberString(4)}`;
        }
      } catch (e) {}
      story.url = newUrl;
    }

    story.authors = await this.authorService.syncAuthors(story.authors || []);
    story.genres = await this.genreService.getValidGenres(story.genres || []);

    const user = await this.userService.getById(userId);
    const newStory = await this.storyRepository.create(story);
    const now = new Date();
    const savedStory = await this.storyRepository.save({
      ...newStory,
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
  }

  async updateStory(currentStory: Story, updateStory: UpdateStoryDto, userId: number): Promise<Story> {
    const user = await this.userService.getById(userId);
    const authors = await this.authorService.syncAuthors(updateStory.authors || []);
    const genres = await this.genreService.getValidGenres(updateStory.genres || []);
    await this.storyRepository.save({
      ...updateStory,
      id: currentStory.id,
      authors,
      genres,
      updated: new Date(),
      updatedBy: user,
    });
    const saved = await this.getStory(currentStory.id);
    this.eventEmitter.emitAsync(StoryUpdatedEvent.name, new StoryUpdatedEvent(saved)).then();
    return saved;
  }

  async getStoryByUrl(url: string): Promise<Story | null> {
    return await this.storyRepository.findOne({
      where: { url },
    });
  }

  async getStory(id: number): Promise<Story | null> {
    return await this.storyRepository.findOne(id);
  }

  async updateStoryInternal(story: Story, user: User): Promise<boolean> {
    try {
      await this.storyRepository.save({
        ...story,
        updated: new Date(),
        updatedBy: user,
      });
      return true;
    } catch (e) {
      this.logger.warn(`Error while updating story: ${story.id}`, e);
      return false;
    }
  }

  async deleteStory(storyId: number): Promise<void> {
    await this.storyRepository.delete(storyId);
    this.eventEmitter.emitAsync(StoryDeletedEvent.name, new StoryDeletedEvent(storyId)).then();
  }
}
