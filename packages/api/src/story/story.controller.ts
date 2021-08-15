import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  forwardRef,
  Get,
  Inject, Logger,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { StoryService } from "./story.service";
import {
  CreateStoryDto,
  GetStoryDto,
  PaginationResult,
  StoryCategory,
  toInt,
  UpdateStoryDto,
} from "@evergarden/shared";
import JwtGuard from "../auth/jwt/jwt.guard";
import { Role } from "../auth/role/roles.decorator";
import { RolesGuard } from "../auth/role/roles.guard";
import { ReadingHistoryService } from "../reading-history/reading-history.service";
import { JwtConfig } from "../auth/jwt/jwt-config.decorator";
import { UserService } from "../user/user.service";
import { isGod, isNumber, isOwnerOrGod } from "../utils";
import { StorySearchBody } from "@evergarden/shared/lib/common-types";

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
    @Query(
      "ids",
      new ParseArrayPipe({
        separator: ",",
        items: Number,
        optional: true,
      }),
    )
    ids: number[],
    @Query("search") search: string,
    @Req() req,
  ): Promise<PaginationResult<GetStoryDto> | GetStoryDto[] | StorySearchBody[]> {
    limit = toInt(limit);
    const pagination = {
      page: toInt(page),
      skip: toInt(skip),
      limit: limit > 100 ? 100 : limit,
    };

    const imGod = isGod(req);

    switch (category) {
      case "updated":
        return await this.storyService.getLastUpdatedStories(pagination, imGod);
      case "hot":
        return await this.storyService.getHotStories(pagination, imGod);
      case "user":
        if (!req.user) {
          throw new UnauthorizedException();
        }
        return await this.storyService.getUserStories(req.user.id);
      default:
        if (ids && ids.length > 0) {
          const result = await this.storyService.getStoriesByIds(ids || []);
          if (imGod) {
            return result;
          }
          const unpublishedStory = result.find((item) => !item.published);
          if (unpublishedStory) {
            throw new ForbiddenException(`Story ${unpublishedStory.id} isn't published yet`);
          }
          return result;
        } else if (search) {
          return await this.storyService.search(search.trim());
        }
        return [];
    }
  }

  @Get(":idOrSlug")
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getStory(
    @Param("idOrSlug") idOrSlug: string | number,
    @Query("check", ParseBoolPipe) check: boolean,
    @Req() req,
  ): Promise<GetStoryDto | boolean> {
    const storyData = this.isSlug(idOrSlug)
      ? await this.storyService.getStoryByUrl(idOrSlug)
      : await this.storyService.getStory(idOrSlug);

    if (check) {
      return !!storyData;
    }

    if (!storyData) {
      throw new NotFoundException();
    }

    if (storyData && !isOwnerOrGod(req, storyData) && !storyData.published) {
      throw new ForbiddenException();
    }

    return this.storyService.toDto(storyData);
  }

  private isSlug(idOrSlug: number | string): idOrSlug is string {
    return !isNumber(idOrSlug);
  }

  @Post()
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async addStory(@Body() story: CreateStoryDto, @Req() req): Promise<GetStoryDto> {
    if (isNumber(story.title)) {
      throw new BadRequestException("Story title can't only contain numbers");
    }
    return await this.storyService.addStory(story, req.user);
  }

  @Put(":id")
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async updateStory(@Param("id") id: number, @Body() story: UpdateStoryDto, @Req() req): Promise<GetStoryDto> {
    if (isNumber(story.title)) {
      throw new BadRequestException("Story title can't only contain numbers");
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
  async deleteStory(@Param("id") id: number, @Req() req) {
    const story = await this.storyService.getStory(id);
    if (!story) {
      throw new NotFoundException();
    }

    if (!isOwnerOrGod(req, story)) {
      throw new ForbiddenException();
    }

    await this.storyService.deleteStory(story.id);
  }
}
