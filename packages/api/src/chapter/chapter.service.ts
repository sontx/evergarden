import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import {
  CreateChapterDto,
  GetChapterDto,
  GetPreviewChapter,
  PaginationResult,
  UpdateChapterDto,
} from "@evergarden/shared";
import { Story } from "../story/story.entity";
import { StoryService } from "../story/story.service";
import { UserService } from "../user/user.service";
import { Pageable } from "../common/pageable";

function toPreviewDto(item: Chapter): GetPreviewChapter {
  return {
    id: item.id,
    chapterNo: item.chapterNo,
    title: item.title,
    published: item.published,
    created: item.created,
  };
}

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter) private chapterRepository: Repository<Chapter>,
    private storyService: StoryService,
    private userService: UserService,
  ) {}

  async getChapterById(chapterId: number): Promise<Chapter> {
    return this.chapterRepository.findOne(chapterId);
  }

  async getChapterByNo(storyId: number, chapterNo: number): Promise<Chapter | null> {
    return await this.chapterRepository.findOne({
      where: {
        chapterNo,
        storyId,
      },
    });
  }

  async getChapters(
    storyId: number,
    pageable: Pageable,
    options: {
      includesUnpublished?: boolean;
      sort?: "asc" | "desc";
    },
  ): Promise<PaginationResult<GetPreviewChapter> | GetPreviewChapter[]> {
    const findOptions: FindManyOptions<Chapter> = {
      where: { storyId: storyId, ...(!options.includesUnpublished ? { published: true } : {}) },
      order: { chapterNo: options.sort === "asc" ? "ASC" : "DESC" },
      take: pageable.limit,
      skip: pageable.skip,
      loadEagerRelations: false,
      select: ["id", "chapterNo", "title", "published", "created"],
    };

    if (pageable.needPaging) {
      const result = await this.chapterRepository.findAndCount(findOptions);
      return pageable.toPaginationResult(result, toPreviewDto);
    }

    const result = await this.chapterRepository.find(findOptions);
    return result.map(toPreviewDto);
  }

  async addChapter(story: Story, chapter: CreateChapterDto, userId: number): Promise<GetChapterDto> {
    const user = await this.userService.getById(userId);
    let newChapter = await this.chapterRepository.create(chapter);
    const now = new Date();
    newChapter = await this.chapterRepository.save({
      ...newChapter,
      storyId: story.id,
      created: now,
      updated: now,
      createdBy: user,
      updatedBy: user,
      chapterNo: (story.lastChapter || 0) + 1,
    });
    const updatedStory = await this.storyService.updateStoryInternal(
      { ...story, lastChapter: newChapter.chapterNo },
      user,
    );
    if (!updatedStory) {
      await this.chapterRepository.delete(newChapter.id as any);
      throw new BadRequestException("Cannot update story");
    }
    return ChapterService.toDto(newChapter);
  }

  async updateChapter(currentChapter: Chapter, newChapter: UpdateChapterDto, userId: number): Promise<GetChapterDto> {
    const user = await this.userService.getById(userId);
    const updatedChapter: Partial<Chapter> = {
      title: newChapter.title || currentChapter.title,
      content: newChapter.content || currentChapter.content,
      published: newChapter.published || currentChapter.published,
      updatedBy: user,
      updated: new Date(),
    };
    await this.chapterRepository.update(currentChapter.id, updatedChapter);
    return ChapterService.toDto({
      ...currentChapter,
      ...updatedChapter,
    });
  }

  static toDto(chapter: Chapter): GetChapterDto {
    return (
      chapter && {
        storyId: chapter.storyId,
        id: chapter.id,
        chapterNo: chapter.chapterNo,
        title: chapter.title,
        created: chapter.created,
        updated: chapter.updated,
        updatedBy: UserService.toDto(chapter.updatedBy),
        createdBy: UserService.toDto(chapter.createdBy),
        content: chapter.content,
        published: chapter.published,
      }
    );
  }
}
