import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import { GetChapterDto, IdType, PaginationOptions, PaginationResult } from "@evergarden/shared";

@Injectable()
export class ChapterService {
  private readonly logger = new Logger(ChapterService.name);

  constructor(@InjectRepository(Chapter) private chapterRepository: Repository<Chapter>) {}

  async getChapterByNo(storyId: IdType, chapterNo: number): Promise<GetChapterDto> {
    const chapter = await this.chapterRepository.findOne({
      where: { chapterNo, storyId },
      select: Object.keys(new GetChapterDto()) as (keyof Chapter)[],
    });
    return chapter && this.toDto(chapter);
  }

  async getChapters(
    storyId: IdType,
    pagination: PaginationOptions,
    includesContent?: boolean,
  ): Promise<PaginationResult<GetChapterDto>> {
    const result = await this.chapterRepository.findAndCount({
      where: { published: true, storyId },
      order: { chapterNo: "DESC" },
      take: pagination.limit,
      skip: pagination.page * pagination.limit,
      select: includesContent ? (Object.keys(new GetChapterDto()) as (keyof Chapter)[]) : undefined,
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

  private toDto(chapter: Chapter): GetChapterDto {
    return {
      id: chapter.id,
      chapterNo: chapter.chapterNo,
      title: chapter.title,
      updated: chapter.updated,
      updatedBy: chapter.updatedBy,
      uploadBy: chapter.uploadBy,
      content: chapter.content,
      published: chapter.published,
    };
  }
}
