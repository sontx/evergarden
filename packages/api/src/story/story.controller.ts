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
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { StoryService } from "./story.service";
import {
  CreateStoryDto,
  GetStoryDto,
  PaginationResult,
  StoryCategory,
  StorySearchBody,
  toInt,
  UpdateStoryDto,
} from "@evergarden/shared";
import JwtGuard from "../auth/jwt/jwt.guard";
import { Role } from "../auth/role/roles.decorator";
import { RolesGuard } from "../auth/role/roles.guard";
import { ReadingHistoryService } from "../reading-history/reading-history.service";
import { JwtConfig } from "../auth/jwt/jwt-config.decorator";
import { UserService } from "../user/user.service";

@Controller("stories")
export class StoryController {
  constructor(
    private readonly storyService: StoryService,
    @Inject(forwardRef(() => ReadingHistoryService)) private readingHistoryService: ReadingHistoryService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getStories(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("category") category: StoryCategory,
    @Query("search") search,
    @Req() req,
  ): Promise<PaginationResult<GetStoryDto> | StorySearchBody[]> {
    await new Promise((resolve) => setTimeout(() => resolve(null), 2000));
    page = toInt(page);
    limit = toInt(limit);

    const pagination = {
      page,
      limit: limit > 100 ? 100 : limit,
    };
    let stories: PaginationResult<GetStoryDto>;
    if (category === "updated") {
      stories = await this.storyService.getLastUpdatedStories(pagination, false);
      await this.mergeWithHistories(stories, req);
    } else if (category === "hot") {
      stories = await this.storyService.getHotStories(pagination, false);
      await this.mergeWithHistories(stories, req);
    } else if (category === "following") {
      const followingStories = await this.getFollowingStories(req);
      stories = {
        items: followingStories,
        meta: {
          totalItems: followingStories.length,
          totalPages: 1,
          itemCount: followingStories.length,
          itemsPerPage: followingStories.length,
          currentPage: 1,
        },
      };
    } else if (search) {
      return await this.storyService.search(search);
    }

    return stories;
  }

  private async mergeWithHistories(stories: PaginationResult<GetStoryDto>, req) {
    if (stories && req.user && req.user.historyId) {
      const history = await this.readingHistoryService.getReadingHistory(req.user.historyId);
      if (history) {
        const histories = history.storyHistories || {};
        for (const story of stories.items) {
          if (histories[story.id]) {
            story.history = this.readingHistoryService.toDto(histories[story.id]);
          }
        }
      }
    }
  }

  private async getFollowingStories(@Req() req): Promise<GetStoryDto[]> {
    const { historyId } = req.user;

    const history = await this.readingHistoryService.getReadingHistory(historyId);
    const stories = history.storyHistories || {};

    const keys = Object.keys(stories);
    const followingStoryIds = keys.filter((key) => {
      const storyHistory = stories[key];
      return storyHistory.isFollowing;
    });

    const followingStories = await this.storyService.getStoriesByIds(followingStoryIds);
    for (const story of followingStories) {
      story.history = this.readingHistoryService.toDto(stories[story.id]);
    }

    return followingStories;
  }

  @Get(":id")
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getStory(@Param("id") id: string, @Query("url", ParseBoolPipe) url = false, @Req() req): Promise<GetStoryDto> {
    const storyData = url ? await this.storyService.getStoryByUrl(id) : await this.storyService.getStory(id);
    const story = this.storyService.toDto(storyData);
    if (story) {
      if (req.user && req.user.historyId) {
        story.history = await this.readingHistoryService.getStoryHistory(req.user.historyId, story.id);
      }
      const uploader = await this.userService.getById(story.uploadBy as string);
      const updater = await this.userService.getById(story.updatedBy as string);
      story.uploadBy = this.userService.toDto(uploader);
      story.updatedBy = this.userService.toDto(updater);
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
        const storyData = await this.storyService.updateStory(id, story, req.user);
        return this.storyService.toDto(storyData);
      }
      throw new ForbiddenException();
    } else {
      throw new NotFoundException();
    }
  }
}
