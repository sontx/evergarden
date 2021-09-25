import { BadRequestException, forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Story } from "./story.entity";
import {
  CreateStoryDto,
  GetStoryDto,
  PaginationOptions,
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
  ) {
    this.toDto = this.toDto.bind(this);
  }

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
    return stories.map(this.toDto);
  }

  async getStories(
    options: PaginationOptions,
    findOption?: FindManyOptions<Story>,
    includeUnpublished?: boolean,
  ): Promise<PaginationResult<GetStoryDto>> {
    const { where = {}, ...rest } = findOption || ({} as any);
    const result = await this.storyRepository.findAndCount({
      ...rest,
      where: includeUnpublished ? where : { published: true, ...where },
      take: options.limit,
      skip: StoryService.getQuerySkip(options),
    });
    return this.toPaginationResult(options, result);
  }

  private static getQuerySkip(options: PaginationOptions): number {
    const value = isFinite(options.skip) ? options.skip : options.page * options.limit;
    return isFinite(value) ? value : 0;
  }

  private toPaginationResult(options: PaginationOptions, result: [Story[], number]): PaginationResult<GetStoryDto> {
    return {
      items: result[0].map(this.toDto),
      meta: {
        currentPage: options.page,
        itemsPerPage: options.limit,
        totalItems: result[1],
        itemCount: result[0].length,
        totalPages: Math.ceil(result[1] / options.limit),
      },
    };
  }

  async getStoriesByGenres(genres: number[], options: PaginationOptions, includeUnpublished?: boolean) {
    return this.getStoriesByJoin(genres, "genres", options, includeUnpublished);
  }

  async getStoriesByAuthors(authors: number[], options: PaginationOptions, includeUnpublished?: boolean) {
    return this.getStoriesByJoin(authors, "authors", options, includeUnpublished);
  }

  private async getStoriesByJoin(
    joinIds: number[],
    joinTable: "genres" | "authors",
    options: PaginationOptions,
    includeUnpublished?: boolean,
  ) {
    let query = this.storyRepository
      .createQueryBuilder("story")
      .innerJoin(`story.${joinTable}`, joinTable)
      .take(options.limit)
      .skip(StoryService.getQuerySkip(options))
      .orderBy("story.updated", "DESC");
    query = includeUnpublished
      ? query.where(`story.published = 1 and ${joinTable}.id in (:...joinIds)`, { joinIds })
      : query.where(`${joinTable}.id in (:...joinIds)`, { joinIds });
    if (options.page !== undefined) {
      const result = await query.getManyAndCount();
      return this.toPaginationResult(options, result);
    }
    return await query.getMany();
  }

  async getLastUpdatedStories(
    options: PaginationOptions,
    includeUnpublished?: boolean,
  ): Promise<PaginationResult<GetStoryDto>> {
    return this.getStories(
      options,
      {
        order: { updated: "DESC" },
      },
      includeUnpublished,
    );
  }

  async getHotStories(
    options: PaginationOptions,
    includeUnpublished?: boolean,
  ): Promise<PaginationResult<GetStoryDto>> {
    // TODO: implement later
    return this.getLastUpdatedStories(options, includeUnpublished);
  }

  async getUserStories(userId: number): Promise<GetStoryDto[]> {
    const result = await this.getStories(
      { page: 0, skip: 0, limit: 99999990 },
      {
        where: { createdBy: userId },
        order: { updated: "DESC" },
      },
      true,
    );
    return result.items;
  }

  toDto(story: Story): GetStoryDto {
    return (
      story && {
        ...story,
        createdBy: this.userService.toDto(story.createdBy),
        updatedBy: this.userService.toDto(story.updatedBy),
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
    return this.toDto(savedStory);
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
