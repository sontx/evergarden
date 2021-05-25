import { BadRequestException, Injectable, Logger } from "@nestjs/common";
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

  async getChapterByNo(storyId: IdType, chapterNo: number): Promise<GetChapterDto | null> {
    const chapter = await this.chapterRepository.findOne({
      where: { chapterNo, storyId: new ObjectID(storyId) },
    });

    const updatedBy = await this.userService.getById(chapter.updatedBy);
    const uploadBy = await this.userService.getById(chapter.uploadBy);
    return (
      chapter && {
        ...chapter,
        updatedBy: updatedBy ? this.userService.toDto(updatedBy) : chapter.updatedBy,
        uploadBy: uploadBy ? this.userService.toDto(uploadBy) : chapter.uploadBy,
      }
    );
  }

  async getChapters(
    storyId: IdType,
    pagination: PaginationOptions,
    includesContent?: boolean,
  ): Promise<PaginationResult<GetChapterDto>> {
    const result = await this.chapterRepository.findAndCount({
      where: { storyId: new ObjectID(storyId), published: true },
      order: { chapterNo: "DESC" },
      take: pagination.limit,
      skip: pagination.page * pagination.limit,
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
    try {
      let newChapter = await this.chapterRepository.create(chapter);
      const now = new Date();
      newChapter = await this.chapterRepository.save({
        ...newChapter,
        storyId: story.id,
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
        await this.chapterRepository.delete(newChapter.id);
        throw new BadRequestException("Cannot update story");
      }
      return this.toDto(newChapter);
    } catch (e) {
      this.logger.warn(`Error while adding new chapter to story ${story.id}`, e);
      throw new BadRequestException();
    }
  }

  private toDto(chapter: Chapter): GetChapterDto {
    return {
      id: chapter.id,
      chapterNo: chapter.chapterNo,
      storyId: chapter.storyId,
      title: chapter.title,
      created: chapter.created,
      updated: chapter.updated,
      updatedBy: chapter.updatedBy,
      uploadBy: chapter.uploadBy,
      content: chapter.content,
      published: chapter.published,
    };
  }
}
