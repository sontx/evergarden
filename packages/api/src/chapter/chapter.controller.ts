import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import {
  CreateChapterDto,
  GetChapterDto,
  PaginationResult,
  toInt,
  UpdateChapterDto,
  GetPreviewChapter,
} from "@evergarden/shared";
import { Role } from "../auth/role/roles.decorator";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { StoryService } from "../story/story.service";
import { isOwnerOrGod } from "../utils";
import { JwtConfig } from "../auth/jwt/jwt-config.decorator";
import { Chapter } from "./chapter.entity";
import { CreateReportChapterDto } from "@evergarden/shared";

@Controller()
export class ChapterController {
  private readonly logger = new Logger(ChapterController.name);

  constructor(private chapterService: ChapterService, private storyService: StoryService) {}

  @Get("chapters/:id")
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getChapter(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const chapter = await this.chapterService.getChapterById(id);
    if (!chapter) {
      throw new NotFoundException();
    }
    if (!chapter.published && !isOwnerOrGod(req, chapter)) {
      throw new ForbiddenException();
    }
    return this.chapterService.toDto(chapter);
  }

  @Get("stories/:storyId/chapters/:chapterNo")
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getChapterByChapterNo(
    @Param("storyId", ParseIntPipe) storyId: number,
    @Param("chapterNo", ParseIntPipe) chapterNo: number,
    @Req() req,
  ): Promise<GetChapterDto> {
    const story = await this.storyService.getStory(storyId);
    if (!story) {
      throw new NotFoundException();
    }

    let chapter: Chapter;
    if (storyId && chapterNo > 0) {
      chapter = await this.chapterService.getChapterByNo(storyId, chapterNo);
      if (!chapter) {
        throw new NotFoundException();
      }
      if (!chapter.published && !isOwnerOrGod(req, story)) {
        throw new ForbiddenException();
      }

      return this.chapterService.toDto(chapter);
    }
    throw new BadRequestException();
  }

  @Get("stories/:storyId/chapters")
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getChapters(
    @Param("storyId", ParseIntPipe) storyId: number,
    @Query("page") page,
    @Query("skip") skip,
    @Query("limit") limit,
    @Query("sort") sort: "asc" | "desc",
    @Req() req,
  ): Promise<PaginationResult<GetPreviewChapter>> {
    page = toInt(page);
    limit = toInt(limit);
    skip = toInt(skip);

    const story = await this.storyService.getStory(storyId);
    if (!story) {
      throw new NotFoundException();
    }

    try {
      return await this.chapterService.getChapters(
        storyId,
        {
          page,
          skip,
          limit: limit > 100 ? 100 : limit,
        },
        isOwnerOrGod(req, story),
        sort,
      );
    } catch (e) {
      this.logger.warn(`Error while finding chapters of story ${storyId}`, e);
      throw new BadRequestException();
    }
  }

  @Post("stories/:storyId/chapters")
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async addChapter(
    @Param("storyId", ParseIntPipe) storyId: number,
    @Body() chapter: CreateChapterDto,
    @Req() req,
  ): Promise<GetChapterDto> {
    const story = await this.getStoryAndCheckPermission(storyId, req);
    return this.chapterService.addChapter(story, chapter, req.user);
  }

  @Put("stories/:storyId/chapters/:chapterNo")
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async updateChapter(
    @Param("storyId", ParseIntPipe) storyId: number,
    @Param("chapterNo", ParseIntPipe) chapterNo: number,
    @Body() chapter: UpdateChapterDto,
    @Req() req,
  ): Promise<GetChapterDto> {
    const story = await this.storyService.getStory(storyId);
    if (!isOwnerOrGod(req, story)) {
      throw new ForbiddenException();
    }
    const currentChapter = await this.chapterService.getChapterByNo(storyId, chapterNo);
    if (!currentChapter) {
      throw new NotFoundException();
    }
    return this.chapterService.updateChapter(currentChapter, chapter, req.user);
  }

  private async getStoryAndCheckPermission(storyId: number, req) {
    const story = await this.storyService.getStory(storyId);
    if (!story) {
      throw new NotFoundException("Story was not found");
    }

    if (story.status === "full") {
      throw new BadRequestException("Story's status is full, so you can't add more chapters");
    }

    if (!isOwnerOrGod(req, story)) {
      throw new ForbiddenException();
    }

    return story;
  }

  @Post("chapters/:chapterId/report")
  @JwtConfig({ anonymous: true })
  @UseGuards(JwtGuard, RolesGuard)
  async reportChapter(
    @Param("chapterId", ParseIntPipe) chapterId: number,
    @Body() report: CreateReportChapterDto,
    @Req() req,
  ) {
    const chapter = await this.chapterService.getChapterById(chapterId);
    if (!chapter) {
      throw new NotFoundException();
    }

    const { id } = req.user || {};
    await this.chapterService.report(chapter, report, id);
  }
}
