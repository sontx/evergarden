import {BadRequestException, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, Repository} from "typeorm";
import {Story} from "./story.entity";
import {
  AuthUser,
  CreateStoryDto,
  GetStoryDto,
  IdType,
  PaginationOptions,
  PaginationResult,
  randomNumberString,
  stringToSlug,
  UpdateStoryDto,
} from "@evergarden/shared";

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(@InjectRepository(Story) private storyRepository: Repository<Story>) {}

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
        skip: options.page * options.limit,
      });
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
    } catch (e) {
      this.logger.warn("Error while querying stories", e);
      throw new BadRequestException();
    }
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
    return this.getStories(
      options,
      {
        order: { view: "DESC" },
      },
      includeUnpublished,
    );
  }

  private toDto(story: Story): GetStoryDto {
    return {
      id: story.id,
      updated: story.updated,
      authors: story.authors,
      lastChapter: story.lastChapter,
      description: story.description,
      genres: story.genres,
      published: story.published,
      rating: story.rating,
      status: story.status,
      url: story.url,
      thumbnail: story.thumbnail,
      title: story.title,
      view: story.view,
      uploadBy: story.uploadBy,
      updatedBy: story.updatedBy,
    };
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

      const newStory = await this.storyRepository.create(story);
      const savedStory = await this.storyRepository.save({
        ...newStory,
        updated: new Date(),
        uploadBy: user.id,
        updatedBy: user.id,
      });
      return this.toDto(savedStory);
    } catch (e) {
      this.logger.warn("Error while adding new story", e);
      throw new BadRequestException();
    }
  }

  async getStoryByUrl(url: string): Promise<GetStoryDto | null> {
    try {
      const story = await this.storyRepository.findOne({
        where: { url },
      });
      return story ? this.toDto(story) : null;
    } catch (e) {
      this.logger.warn(`Error while querying story: ${url}`, e);
      throw new BadRequestException();
    }
  }

  async getStory(id: IdType): Promise<GetStoryDto | null> {
    try {
      const story = await this.storyRepository.findOne(id);
      return story ? this.toDto(story) : null;
    } catch (e) {
      this.logger.warn(`Error while querying story: ${id}`, e);
      throw new BadRequestException();
    }
  }

  async updateStory(id: IdType, story: UpdateStoryDto, user: AuthUser): Promise<GetStoryDto> {
    try {
      await this.storyRepository.update(id, {
        ...story,
        updatedBy: user.id,
      });
      return this.getStory(id);
    } catch (e) {
      this.logger.warn(`Error while updating story: ${id}`, e);
      throw new BadRequestException();
    }
  }
}
