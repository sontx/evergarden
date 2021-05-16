import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { GetChapterDto, PaginationResult } from "@evergarden/shared";

@Controller()
export class ChapterController {
  private readonly logger = new Logger(ChapterController.name);

  constructor(private chapterService: ChapterService) {}

  @Get("stories/:storyId/chapters/:chapterNo")
  async getChapterByChapterNo(
    @Param("storyId") storyId: string,
    @Param("chapterNo") chapterNo: number,
  ): Promise<GetChapterDto> {
    try {
      if (storyId && chapterNo >= 0) {
        const chapter = await this.chapterService.getChapterByNo(storyId, chapterNo);
        if (!chapter) {
          throw new BadRequestException();
        }
        return chapter;
      }
    } catch (e) {
      this.logger.warn(`Error while finding chapter by its No: storyId = ${storyId}, chapterNo = ${chapterNo}`, e);
      throw new BadRequestException();
    }
  }

  @Get("stories/:storyId/chapters")
  getChapters(
    @Param("storyId") storyId: string,
    @Query("page", ParseIntPipe) page = 1,
    @Query("limit", ParseIntPipe) limit = 10,
    @Query("includesContent", ParseBoolPipe) includesContent = false,
  ): Promise<PaginationResult<GetChapterDto>> {
    try {
      return this.chapterService.getChapters(
        storyId,
        {
          page,
          limit: limit < 0 ? 0 : limit,
        },
        includesContent,
      );
    } catch (e) {
      this.logger.warn(`Error while finding chapters of story ${storyId}`, e);
      throw new BadRequestException();
    }
  }
}
