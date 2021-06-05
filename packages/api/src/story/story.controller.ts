import {
  Body,
  Controller,
  Delete,
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
  UnauthorizedException,
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
import { StoryHistory } from "../reading-history/story-history.entity";
import { delay, isDevelopment, isOwnerOrGod } from "../utils";

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
    @Query("page") page,
    @Query("skip") skip,
    @Query("limit") limit,
    @Query("category") category: StoryCategory,
    @Query("search") search,
    @Req() req,
  ): Promise<PaginationResult<GetStoryDto> | StorySearchBody[]> {
    if (isDevelopment()) {
      await delay(2000);
    }

    page = toInt(page);
    limit = toInt(limit);
    skip = toInt(skip);

    const pagination = {
      page,
      skip,
      limit: limit > 100 ? 100 : limit,
    };

    let stories: PaginationResult<GetStoryDto>;

    switch (category) {
      case "updated":
        stories = await this.storyService.getLastUpdatedStories(pagination, false);
        await this.mergeWithHistories(stories, req);
        break;
      case "hot":
        stories = await this.storyService.getHotStories(pagination, false);
        await this.mergeWithHistories(stories, req);
        break;
      case "following":
      case "history":
        if (!req.user) {
          throw new UnauthorizedException();
        }
        const filter = category === "following" ? (story) => story.isFollowing : () => true;
        const historyStories = await this.getHistoryStories(req, filter);
        stories = {
          items: historyStories,
          meta: {
            totalItems: historyStories.length,
            totalPages: 1,
            itemCount: historyStories.length,
            itemsPerPage: historyStories.length,
            currentPage: 1,
          },
        };
        break;
      case "user":
        stories = await this.storyService.getUserStories(req.user.id);
        await this.mergeWithHistories(stories, req);
        break;
      default:
        if (search) {
          return await this.storyService.search(search);
        }
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

  private async getHistoryStories(@Req() req, filter: (story: StoryHistory) => boolean): Promise<GetStoryDto[]> {
    const { historyId } = req.user;

    const history = await this.readingHistoryService.getReadingHistory(historyId);
    const storyHistories = history.storyHistories || {};

    const keys = Object.keys(storyHistories);
    const filterIds = keys.filter((key) => {
      const storyHistory = storyHistories[key];
      return filter(storyHistory);
    });

    const stories = await this.storyService.getStoriesByIds(filterIds);
    for (const story of stories) {
      story.history = this.readingHistoryService.toDto(storyHistories[story.id]);
    }

    return stories;
  }

  @Get(":id")
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getStory(
    @Param("id") id: string,
    @Query("url", ParseBoolPipe) url = false,
    @Query("check", ParseBoolPipe) check: boolean,
    @Req() req,
  ): Promise<GetStoryDto | boolean> {
    const storyData = url ? await this.storyService.getStoryByUrl(id) : await this.storyService.getStory(id);
    if (check) {
      return !!storyData;
    }

    if (storyData && !isOwnerOrGod(req, storyData) && !storyData.published) {
      throw new ForbiddenException();
    }

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
  async addStory(@Body() story: CreateStoryDto, @Req() req): Promise<GetStoryDto> {
    if (isDevelopment()) {
      await delay(2000);
    }
    return await this.storyService.addStory(story, req.user);
  }

  @Put(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async updateStory(@Param("id") id: string, @Body() story: UpdateStoryDto, @Req() req): Promise<GetStoryDto> {
    if (isDevelopment()) {
      await delay(2000);
    }

    const currentStory = await this.storyService.getStory(id);
    if (currentStory) {
      if (isOwnerOrGod(req, currentStory)) {
        const storyData = await this.storyService.updateStory(currentStory, story, req.user);
        return this.storyService.toDto(storyData);
      }
      throw new ForbiddenException();
    } else {
      throw new NotFoundException();
    }
  }

  @Delete(":id")
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async deleteStory(@Param("id") id: string, @Req() req) {
    if (isDevelopment()) {
      await delay(2000);
    }

    const story = await this.storyService.getStory(id);
    if (!story) {
      throw new NotFoundException();
    }

    if (!isOwnerOrGod(req, story)) {
      throw new ForbiddenException();
    }

    await this.storyService.deleteStory(story.id.toHexString());
  }
}
