import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Story } from "./story.entity";
import { AuthUser, CreateStoryDto, GetStoryDto, PaginationOptions, PaginationResult } from "@evergarden/shared";

@Injectable()
export class StoryService {
  constructor(@InjectRepository(Story) private storyRepository: Repository<Story>) {}

  async getStories(
    options: PaginationOptions,
    findOption?: FindManyOptions<Story>,
    includeUnpublished?: boolean,
  ): Promise<PaginationResult<GetStoryDto>> {
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
    };
  }

  async addStory(story: CreateStoryDto, user: AuthUser): Promise<GetStoryDto> {
    const newStory = await this.storyRepository.create(story);
    newStory.updated = new Date();
    newStory.uploadBy = user.id;
    const savedStory = await this.storyRepository.save(newStory);
    return this.toDto(savedStory);
  }
}
