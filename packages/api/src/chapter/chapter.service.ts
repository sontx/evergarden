import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import {
  CreateChapterDto,
  GetChapterDto,
  PaginationOptions,
  PaginationResult,
  UpdateChapterDto,
} from "@evergarden/shared";
import { Story } from "../story/story.entity";
import { StoryService } from "../story/story.service";
import { UserService } from "../user/user.service";

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

  async getChapterByNo(
    storyId: number,
    chapterNo: number,
    includesUnpublished?: boolean,
  ): Promise<GetChapterDto | null> {
    const chapter = await this.chapterRepository.findOne({
      where: {
        chapterNo,
        storyId: storyId,
        ...(!includesUnpublished ? { published: true } : {}),
      },
    });
    return this.toDto(chapter, storyId);
  }

  async getChapters(
    storyId: number,
    pagination: PaginationOptions,
    includesUnpublished?: boolean,
    sort?: "asc" | "desc",
  ): Promise<PaginationResult<GetChapterDto>> {
    const result = await this.chapterRepository.findAndCount({
      where: { storyId: storyId, ...(!includesUnpublished ? { published: true } : {}) },
      order: { chapterNo: sort === "asc" ? "ASC" : "DESC" },
      take: pagination.limit,
      skip: isFinite(pagination.skip) ? pagination.skip : pagination.page * pagination.limit,
      select: ["id", "chapterNo", "title"],
    });

    return {
      items: result[0].map(this.toDto),
      meta: {
        currentPage: pagination.page,
        itemsPerPage: pagination.limit,
        totalItems: result[1],
        itemCount: result[0].length,
        totalPages: Math.ceil(result[1] / pagination.limit),
      },
    };
  }

  async addChapter(story: Story, chapter: CreateChapterDto, userId: number): Promise<GetChapterDto> {
    const user = await this.userService.getById(userId);
    let newChapter = await this.chapterRepository.create(chapter);
    const now = new Date();
    newChapter = await this.chapterRepository.save({
      ...newChapter,
      story: Promise.resolve(story),
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
    return this.toDto(newChapter, story.id);
  }

  async updateChapter(currentChapter: Chapter, newChapter: UpdateChapterDto, userId: number): Promise<GetChapterDto> {
    if (!currentChapter) {
      throw new NotFoundException();
    }
    const user = await this.userService.getById(userId);
    const updatedChapter: Partial<Chapter> = {
      title: newChapter.title || currentChapter.title,
      content: newChapter.content || currentChapter.content,
      published: newChapter.published || currentChapter.published,
      updatedBy: user,
      updated: new Date(),
    };
    await this.chapterRepository.update(currentChapter.id, updatedChapter);
    return this.toDto(
      {
        ...currentChapter,
        ...updatedChapter,
      },
      (await currentChapter.story).id,
    );
  }

  private toDto(chapter: Chapter, storyId: number): GetChapterDto {
    return (
      chapter && {
        storyId,
        id: chapter.id,
        chapterNo: chapter.chapterNo,
        title: chapter.title,
        created: chapter.created,
        updated: chapter.updated,
        updatedBy: chapter.updatedBy,
        createdBy: chapter.createdBy,
        content: chapter.content,
        published: chapter.published,
      }
    );
  }
}
