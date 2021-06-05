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
import { StorageService } from "../storage/storage.service";

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    @InjectRepository(Story) private storyRepository: MongoRepository<Story>,
    private storySearchService: StorySearchService,
    private authorService: AuthorService,
    private genreService: GenreService,
    private storageService: StorageService,
  ) {
    this.toDto = this.toDto.bind(this);
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
    const { where = {}, ...rest } = findOption || ({} as any);
    const result = await this.storyRepository.findAndCount({
      ...rest,
      where: includeUnpublished ? where : { published: true, ...where },
      take: options.limit,
      skip: isFinite(options.skip) ? options.skip : options.page * options.limit,
    });
    return this.toPaginationResult(options, result);
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

  async getUserStories(userId: IdType): Promise<PaginationResult<GetStoryDto>> {
    return this.getStories(
      { page: 0, skip: 0, limit: 99999990 },
      {
        where: { uploadBy: userId },
        order: { updated: "DESC" },
      },
      true,
    );
  }

  async search(text: string): Promise<StorySearchBody[]> {
    const result = await this.storySearchService.search(text);
    return result.map((item) => ({ ...item, thumbnail: this.storageService.makeThumbnailUrl(item.thumbnail) }));
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
        thumbnail: this.storageService.makeThumbnailUrl(story.thumbnail),
        cover: this.storageService.makeThumbnailUrl(story.cover),
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
      await this.syncThumbnail(story);

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

  async updateStory(currentStory: Story, story: UpdateStoryDto, user: AuthUser): Promise<Story> {
    try {
      const authors = await this.authorService.syncAuthors(story.authors || []);
      const genres = await this.genreService.getValidGenres(story.genres || []);
      await this.syncThumbnail(story, currentStory);
      await this.storyRepository.update(currentStory.id, {
        ...story,
        authors,
        genres,
        updated: new Date(),
        updatedBy: user.id,
      });
      const savedStory = await this.getStory(currentStory.id);
      await this.storySearchService.update(savedStory);
      return savedStory;
    } catch (e) {
      this.logger.warn(`Error while updating story: ${currentStory.id}`, e);
      throw new BadRequestException();
    }
  }

  private async syncThumbnail(newStory: CreateStoryDto, oldStory: Partial<Story> = {}): Promise<void> {
    newStory.thumbnail = this.storageService.revertThumbnailName(newStory.thumbnail);
    newStory.cover = this.storageService.revertThumbnailName(newStory.cover);

    const newTempThumbnail = newStory.thumbnail;

    const deleteOldImage = async (type: "thumbnail" | "cover") => {
      await this.storageService.deleteStorageFile("storage", oldStory[type], true);
    };

    const deleteOldImages = async () => {
      if (oldStory.thumbnail !== newStory.thumbnail) {
        await deleteOldImage("thumbnail");
      }
      if (oldStory.cover !== newStory.cover) {
        await deleteOldImage("cover");
      }
    };

    if (!newTempThumbnail) {
      await deleteOldImage("thumbnail");
      await deleteOldImage("cover");
      newStory.thumbnail = "";
      newStory.cover = "";
      return;
    }

    const isTempThumbnail = await this.storageService.isTempThumbnail(newTempThumbnail);
    if (!isTempThumbnail) {
      await deleteOldImages();
      return;
    }

    const result = await this.storageService.saveThumbnail(newTempThumbnail);
    newStory.thumbnail = result.thumbnail;
    newStory.cover = result.cover;

    await deleteOldImages();

    await this.storageService.deleteStorageFile("temp", newTempThumbnail);
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

  async deleteStory(storyId: IdType): Promise<void> {
    await this.storyRepository.delete(storyId);
  }
}
