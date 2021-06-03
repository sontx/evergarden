import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, MongoRepository } from "typeorm";
import { Story } from "./story.entity";
import {
  AuthUser,
  calculateVoteCount,
  CreateStoryDto,
  GetStoryDto,
  IdType,
  PaginationOptions,
  PaginationResult,
  randomNumberString,
  StorySearchBody,
  stringToSlug,
  UpdateStoryDto,
  VoteType,
} from "@evergarden/shared";
import { ObjectID } from "mongodb";
import StorySearchService from "./story-search.service";
import { AuthorService } from "../author/author.service";
import { GenreService } from "../genre/genre.service";

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    @InjectRepository(Story) private storyRepository: MongoRepository<Story>,
    private storySearchService: StorySearchService,
    private authorService: AuthorService,
    private genreService: GenreService,
  ) {
    this.logger.debug("Initializing search engine...");
    this.initializeSearchEngine().then(() => {
      this.logger.debug("Initialized search engine!");
    });
  }

  private async initializeSearchEngine() {
    const stories = await this.storyRepository.find();
    await this.storySearchService.createIndex(stories);
  }

  async getStoriesByIds(ids: IdType[]): Promise<GetStoryDto[]> {
    const stories = await this.storyRepository.findByIds(ids.map((id) => new ObjectID(id)));
    return stories.map(this.toDto);
  }

  async getStories(
    options: PaginationOptions,
    findOption?: FindManyOptions<Story>,
    includeUnpublished?: boolean,
  ): Promise<PaginationResult<GetStoryDto>> {
    try {
      const result = await this.storyRepository.findAndCount({
        ...(findOption || {}),
        where: includeUnpublished ? undefined : { published: true },
        take: options.limit,
        skip: isFinite(options.skip) ? options.skip : options.page * options.limit,
      });
      return this.toPaginationResult(options, result);
    } catch (e) {
      this.logger.warn("Error while querying stories", e);
      throw new BadRequestException();
    }
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

  async search(text: string): Promise<StorySearchBody[]> {
    return await this.storySearchService.search(text);
  }

  toDto(story: Story): GetStoryDto {
    return (
      story && {
        id: story.id,
        created: story.created,
        updated: story.updated,
        authors: story.authors,
        lastChapter: story.lastChapter,
        description: story.description,
        genres: story.genres,
        published: story.published,
        upvote: story.upvote,
        downvote: story.downvote,
        status: story.status,
        url: story.url,
        thumbnail: story.thumbnail,
        title: story.title,
        view: story.view,
        uploadBy: story.uploadBy,
        updatedBy: story.updatedBy,
      }
    );
  }

  async addStory(story: CreateStoryDto, user: AuthUser): Promise<GetStoryDto> {
    try {
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

      const newStory = await this.storyRepository.create(story);
      const now = new Date();
      const savedStory = await this.storyRepository.save({
        ...newStory,
        created: now,
        updated: now,
        uploadBy: user.id,
        updatedBy: user.id,
        view: 0,
        lastChapter: 0,
        upvote: 0,
        downvote: 0,
      });
      await this.storySearchService.add(savedStory);
      return this.toDto(savedStory);
    } catch (e) {
      this.logger.warn("Error while adding new story", e);
      throw new BadRequestException();
    }
  }

  async getStoryByUrl(url: string): Promise<Story | null> {
    try {
      return await this.storyRepository.findOne({
        where: { url },
      });
    } catch (e) {
      this.logger.warn(`Error while querying story: ${url}`, e);
      throw new BadRequestException();
    }
  }

  async getStory(id: IdType): Promise<Story | null> {
    try {
      return await this.storyRepository.findOne(id);
    } catch (e) {
      this.logger.warn(`Error while querying story: ${id}`, e);
      throw new BadRequestException();
    }
  }

  async updateStory(id: IdType, story: UpdateStoryDto, user: AuthUser): Promise<Story> {
    try {
      const authors = await this.authorService.syncAuthors(story.authors || []);
      const genres = await this.genreService.getValidGenres(story.genres || []);
      await this.storyRepository.update(id, {
        ...story,
        authors,
        genres,
        updated: new Date(),
        updatedBy: user.id,
      });
      const savedStory = await this.getStory(id);
      await this.storySearchService.update(savedStory);
      return savedStory;
    } catch (e) {
      this.logger.warn(`Error while updating story: ${id}`, e);
      throw new BadRequestException();
    }
  }

  async updateStoryInternal(story: Story, user: AuthUser): Promise<boolean> {
    try {
      await this.storyRepository.update(story.id, {
        ...story,
        updated: new Date(),
        updatedBy: user.id,
      });
      return true;
    } catch (e) {
      this.logger.warn(`Error while updating story: ${story.id}`, e);
      return false;
    }
  }

  async increaseCount(storyId: IdType) {
    try {
      await this.storyRepository.findOneAndUpdate({ id: new ObjectID(storyId) }, { $inc: { view: 1 } });
    } catch (e) {
      this.logger.warn(`Error while increase view count: ${storyId}`, e);
    }
  }

  async changeRating(storyId: IdType, oldVote?: VoteType, newVote?: VoteType) {
    const result = calculateVoteCount(oldVote, newVote);
    if (result) {
      await this.storyRepository.findOneAndUpdate({ id: new ObjectID(storyId) }, { $inc: result });
    }
  }
}
