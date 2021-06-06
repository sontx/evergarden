import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectID } from "mongodb";
import { Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import {
  AuthUser,
  CreateChapterDto,
  GetChapterDto,
  IdType,
  PaginationOptions,
  PaginationResult,
  UpdateChapterDto,
} from "@evergarden/shared";
import { Story } from "../story/story.entity";
import { StoryService } from "../story/story.service";
import { UserService } from "../user/user.service";

@Injectable()
export class ChapterService {
  private readonly logger = new Logger(ChapterService.name);

  constructor(
    @InjectRepository(Chapter) private chapterRepository: Repository<Chapter>,
    private storyService: StoryService,
    private userService: UserService,
  ) {}

  async getChapterById(chapterId: IdType): Promise<Chapter> {
    return this.chapterRepository.findOne(chapterId);
  }

  async getChapterByNo(
    storyId: IdType,
    chapterNo: number,
    includesUnpublished?: boolean,
  ): Promise<GetChapterDto | null> {
    const chapter = await this.chapterRepository.findOne({
      where: { chapterNo, storyId: storyId, ...(!includesUnpublished ? { published: true } : {}) },
    });

    if (!chapter) {
      return null;
    }

    const updatedBy = chapter.updatedBy && (await this.userService.getById(chapter.updatedBy));
    const uploadBy = chapter.uploadBy && (await this.userService.getById(chapter.uploadBy));
    return (
      chapter && {
        ...chapter,
        storyId: chapter.storyId,
        id: chapter.id.toHexString(),
        updatedBy: updatedBy && this.userService.toDto(updatedBy),
        uploadBy: uploadBy && this.userService.toDto(uploadBy),
      }
    );
  }

  async getChapters(
    storyId: IdType,
    pagination: PaginationOptions,
    includesContent?: boolean,
    includesUnpublished?: boolean,
    sort?: "asc" | "desc",
  ): Promise<PaginationResult<GetChapterDto>> {
    const result = await this.chapterRepository.findAndCount({
      where: { storyId: new ObjectID(storyId), ...(!includesUnpublished ? { published: true } : {}) },
      order: { chapterNo: sort === "asc" ? "ASC" : "DESC" },
      take: pagination.limit,
      skip: isFinite(pagination.skip) ? pagination.skip : pagination.page * pagination.limit,
      select: includesContent
        ? ["id", "storyId", "chapterNo", "created", "updated", "uploadBy", "updatedBy", "published", "title", "content"]
        : ["id", "storyId", "chapterNo", "created", "updated", "uploadBy", "updatedBy", "published", "title"],
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

  async addChapter(story: Story, chapter: CreateChapterDto, user: AuthUser): Promise<GetChapterDto> {
    let newChapter = await this.chapterRepository.create(chapter);
    const now = new Date();
    newChapter = await this.chapterRepository.save({
      ...newChapter,
      storyId: story.id.toHexString(),
      created: now,
      updated: now,
      uploadBy: user.id,
      updatedBy: user.id,
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
    return this.toDto(newChapter);
  }

  async updateChapter(currentChapter: Chapter, newChapter: UpdateChapterDto, user: AuthUser): Promise<GetChapterDto> {
    if (!currentChapter) {
      throw new NotFoundException();
    }
    const updatedChapter: Chapter = {
      ...currentChapter,
      ...newChapter,
      id: new ObjectID(newChapter.id),
      updatedBy: user.id,
      updated: new Date(),
    };
    const { id, ...rest } = updatedChapter;
    await this.chapterRepository.update(id.toHexString(), rest);
    return this.toDto(updatedChapter);
  }

  private toDto(chapter: Chapter): GetChapterDto {
    return (
      chapter && {
        id: chapter.id.toHexString(),
        chapterNo: chapter.chapterNo,
        storyId: chapter.storyId,
        title: chapter.title,
        created: chapter.created,
        updated: chapter.updated,
        updatedBy: chapter.updatedBy,
        uploadBy: chapter.uploadBy,
        content: chapter.content,
        published: chapter.published,
      }
    );
  }
}
