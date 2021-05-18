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
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { CreateChapterDto, GetChapterDto, PaginationResult } from "@evergarden/shared";
import { Role } from "../auth/role/roles.decorator";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { StoryService } from "../story/story.service";
import { UserService } from "../user/user.service";

@Controller()
export class ChapterController {
  private readonly logger = new Logger(ChapterController.name);

  constructor(
    private chapterService: ChapterService,
    private storyService: StoryService,
    private userService: UserService,
  ) {}

  @Get("stories/:storyId/chapters/:chapterNo")
  async getChapterByChapterNo(
    @Param("storyId") storyId: string,
    @Param("chapterNo", ParseIntPipe) chapterNo: number,
  ): Promise<GetChapterDto> {
    await new Promise((resolve) => setTimeout(() => resolve(null), 2000));

    let chapter: GetChapterDto;
    if (storyId && chapterNo >= 0) {
      try {
        chapter = await this.chapterService.getChapterByNo(storyId, chapterNo);
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
  async getChapters(
    @Param("storyId") storyId: string,
    @Query("page", ParseIntPipe) page = 1,
    @Query("limit", ParseIntPipe) limit = 10,
    @Query("includesContent", ParseBoolPipe) includesContent = false,
  ): Promise<PaginationResult<GetChapterDto>> {
    await new Promise((resolve) => setTimeout(() => resolve(null), 2000));
    try {
      return await this.chapterService.getChapters(
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

  @Post("stories/:storyId/chapters")
  @UsePipes(new ValidationPipe({ transform: true }))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async addChapter(
    @Param("storyId") storyId: string,
    @Body() chapter: CreateChapterDto,
    @Req() req,
  ): Promise<GetChapterDto> {
    const story = await this.storyService.getStory(storyId);
    if (!story) {
      throw new NotFoundException("Story was not found");
    }

    const { id: userId, role } = req.user || {};
    const isOwner = story.uploadBy === userId;
    const isAdmin = role === "admin";
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException();
    }

    return this.chapterService.addChapter(story, chapter, req.user);
  }
}
