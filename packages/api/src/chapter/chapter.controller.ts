import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { CreateChapterDto, GetChapterDto, PaginationResult, toInt, UpdateChapterDto } from "@evergarden/shared";
import { Role } from "../auth/role/roles.decorator";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { StoryService } from "../story/story.service";
import { delay, isDevelopment, isOwnerOrGod } from "../utils";
import { JwtConfig } from "../auth/jwt/jwt-config.decorator";

@Controller()
export class ChapterController {
  private readonly logger = new Logger(ChapterController.name);

  constructor(private chapterService: ChapterService, private storyService: StoryService) {}

  @Get("stories/:storyId/chapters/:chapterNo")
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getChapterByChapterNo(
    @Param("storyId") storyId: string,
    @Param("chapterNo", ParseIntPipe) chapterNo: number,
    @Req() req,
  ): Promise<GetChapterDto> {
    if (isDevelopment()) {
      await delay(2000);
    }

    const story = await this.storyService.getStory(storyId);
    if (!story) {
      throw new NotFoundException();
    }

    let chapter: GetChapterDto;
    if (storyId && chapterNo >= 0) {
      try {
        chapter = await this.chapterService.getChapterByNo(storyId, chapterNo, isOwnerOrGod(req, story));
      } catch (e) {
        this.logger.warn(`Error while finding chapter by its No: storyId = ${storyId}, chapterNo = ${chapterNo}`, e);
        throw new BadRequestException();
      }
      if (!chapter) {
        throw new NotFoundException();
      }

      return chapter;
    }
    throw new BadRequestException();
  }

  @Get("stories/:storyId/chapters")
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getChapters(
    @Param("storyId") storyId: string,
    @Query("page") page,
    @Query("skip") skip,
    @Query("limit") limit,
    @Query("sort") sort: "asc" | "desc",
    @Query("includesContent", ParseBoolPipe) includesContent = false,
    @Req() req,
  ): Promise<PaginationResult<GetChapterDto>> {
    if (isDevelopment()) {
      await delay(2000);
    }

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
        includesContent,
        isOwnerOrGod(req, story),
        sort
      );
    } catch (e) {
      this.logger.warn(`Error while finding chapters of story ${storyId}`, e);
      throw new BadRequestException();
    }
  }

  @Post("stories/:storyId/chapters")
  @UsePipes(new ValidationPipe({ transform: true }))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async addChapter(
    @Param("storyId") storyId: string,
    @Body() chapter: CreateChapterDto,
    @Req() req,
  ): Promise<GetChapterDto> {
    const story = await this.getStoryAndCheckPermission(storyId, req);
    return this.chapterService.addChapter(story, chapter, req.user);
  }

  @Put("stories/:storyId/chapters")
  @UsePipes(new ValidationPipe({ transform: true }))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async updateChapter(
    @Param("storyId") storyId: string,
    @Body() chapter: UpdateChapterDto,
    @Req() req,
  ): Promise<GetChapterDto> {
    const story = await this.getStoryAndCheckPermission(storyId, req);
    return this.chapterService.updateChapter(story, chapter, req.user);
  }

  private async getStoryAndCheckPermission(storyId: string, req) {
    const story = await this.storyService.getStory(storyId);
    if (!story) {
      throw new NotFoundException("Story was not found");
    }

    if (story.status === "full") {
      throw new BadRequestException("Story's status is full, so you cann't add more chapters");
    }

    if (!isOwnerOrGod(req, story)) {
      throw new ForbiddenException();
    }

    return story;
  }
}
