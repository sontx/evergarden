import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Story} from "./story.entity";
import {CreateStoryDto, GetStoryDto} from "@evergarden/shared";
import {PaginationOptions, PaginationResult} from "../utils/pagination";

@Injectable()
export class StoryService {
  constructor(@InjectRepository(Story) private storyRepository: Repository<Story>) {}

  async getLastUpdatedStories(options: PaginationOptions): Promise<PaginationResult<GetStoryDto>> {
    const result = await this.storyRepository.findAndCount({
      where: { published: true }, order: { updated: "DESC" },
      take: options.limit,
      skip: options.page * options.limit
    });
    return {
      items: result[0].map(this.toDto),
      meta: {
        currentPage: options.page,
        itemsPerPage: options.limit,
        totalItems: result[1],
        itemCount: result[0].length,
        totalPages: Math.ceil(result[1] / options.limit)
      }
    }
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
      view: story.view
    }
  }

  async addStory(story: CreateStoryDto): Promise<GetStoryDto> {
    const newStory = await this.storyRepository.create(story);
    newStory.updated = new Date();
    const savedStory = await this.storyRepository.save(newStory);
    return this.toDto(savedStory);
  }
}
