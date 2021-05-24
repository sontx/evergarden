import {
  Body,
  Controller,
  ForbiddenException,
  forwardRef,
  Get,
  Inject,
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
import { StoryService } from "./story.service";
import { CreateStoryDto, GetStoryDto, PaginationResult, StoryCategory, UpdateStoryDto } from "@evergarden/shared";
import JwtGuard from "../auth/jwt/jwt.guard";
import { Role } from "../auth/role/roles.decorator";
import { RolesGuard } from "../auth/role/roles.guard";
import { ReadingHistoryService } from "../reading-history/reading-history.service";
import {JwtConfig} from "../auth/jwt/jwt-config.decorator";

@Controller("stories")
export class StoryController {
  constructor(
    private readonly storyService: StoryService,
    @Inject(forwardRef(() => ReadingHistoryService)) private readingHistoryService: ReadingHistoryService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  @JwtConfig({anonymous: true})
  async getStories(
    @Query("page", ParseIntPipe) page = 1,
    @Query("limit", ParseIntPipe) limit = 10,
    @Query("category") category: StoryCategory = "updated",
    @Req() req,
  ): Promise<PaginationResult<GetStoryDto>> {
    await new Promise((resolve) => setTimeout(() => resolve(null), 2000));

    const pagination = {
      page,
      limit: limit > 100 ? 100 : limit,
    };
    let stories: PaginationResult<GetStoryDto>;
    if (category === "updated") {
      stories = await this.storyService.getLastUpdatedStories(pagination, false);
    } else if (category === "hot") {
      stories = await this.storyService.getHotStories(pagination, false);
    } else {
      stories = await this.storyService.getStories(pagination, undefined, false);
    }

    if (stories && req.user && req.user.historyId) {
      const history = await this.readingHistoryService.getReadingHistory(req.user.historyId);
      if (history) {
        const histories = history.storyHistories || {}
        for (const story of stories.items) {
          if (histories[story.id]) {
            story.history = histories[story.id] as any;
          }
        }
      }
    }

    return stories;
  }

  @Get(":id")
  async getStory(@Param("id") id: string, @Query("url", ParseBoolPipe) url = false): Promise<GetStoryDto> {
    const story = url ? await this.storyService.getStoryByUrl(id) : await this.storyService.getStory(id);
    if (story) {
      return story;
    }
    throw new NotFoundException();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  addStory(@Body() story: CreateStoryDto, @Req() req): Promise<GetStoryDto> {
    return this.storyService.addStory(story, req.user);
  }

  @Put(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async updateStory(@Param("id") id: string, @Body() story: UpdateStoryDto, @Req() req): Promise<GetStoryDto> {
    const currentStory = await this.storyService.getStory(id);
    if (currentStory) {
      const isUploader = req.user.id === currentStory.uploadBy;
      const isAdminOrMod = req.user.role === "admin" || req.user.role === "mod";
      if (isUploader || isAdminOrMod) {
        return this.storyService.updateStory(id, story, req.user);
      }
      throw new ForbiddenException();
    } else {
      throw new NotFoundException();
    }
  }
}
