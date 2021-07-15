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
  StorySearchBody,
  stringToSlug,
  UpdateStoryDto,
} from "@evergarden/shared";
import StorySearchService from "../search/story-search.service";
import { AuthorService } from "../author/author.service";
import { GenreService } from "../genre/genre.service";
import { StorageService } from "../storage/storage.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { ViewCountService } from "./view-count.service";

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    private storySearchService: StorySearchService,
    private authorService: AuthorService,
    private genreService: GenreService,
    private storageService: StorageService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private viewCountService: ViewCountService,
  ) {
    this.toDto = this.toDto.bind(this);
  }

  async getAll() {
    return await this.storyRepository.find();
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

  async search(text: string): Promise<StorySearchBody[]> {
    const result = await this.storySearchService.search(text);
    return result.map((item) => ({
      ...item,
      thumbnail: this.storageService.makeThumbnailUrl(item.thumbnail),
    }));
  }

  toDto(story: Story): GetStoryDto {
    return (
      story && {
        ...story,
        createdBy: this.userService.toDto(story.createdBy),
        updatedBy: this.userService.toDto(story.updatedBy),
        thumbnail: this.storageService.makeThumbnailUrl(story.thumbnail),
        cover: this.storageService.makeThumbnailUrl(story.cover),
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
    await this.syncThumbnail(story);

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
    await this.storySearchService.add(savedStory);
    return this.toDto(savedStory);
  }

  async updateStory(currentStory: Story, story: UpdateStoryDto, userId: number): Promise<Story> {
    const user = await this.userService.getById(userId);
    const authors = await this.authorService.syncAuthors(story.authors || []);
    const genres = await this.genreService.getValidGenres(story.genres || []);
    await this.syncThumbnail(story, currentStory);
    await this.storyRepository.save({
      ...story,
      id: currentStory.id,
      authors,
      genres,
      updated: new Date(),
      updatedBy: user,
    });
    const savedStory = await this.getStory(currentStory.id);
    await this.storySearchService.update(savedStory);
    return savedStory;
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
    return await this.storyRepository.findOne({
      where: { url },
    });
  }

  async getStory(id: number): Promise<Story | null> {
    return await this.storyRepository.findOne(id);
  }

  async updateStoryInternal(story: Story, user: User): Promise<boolean> {
    try {
      await this.storyRepository.update(story.id as any, {
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

  async increaseCount(storyId: number) {
    try {
      await this.viewCountService.enqueue(storyId, 1);
    } catch (e) {
      this.logger.warn(`Error while increase view count: ${storyId}`, e);
    }
  }

  async deleteStory(storyId: number): Promise<void> {
    await this.storyRepository.delete(storyId);
  }
}
