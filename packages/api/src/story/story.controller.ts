import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { isGod, isNumber, isOwnerOrGod } from "../common/utils";
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "../storage/file.model";
import { Story } from "./story.entity";
import { IStoryStorageService, STORY_STORAGE_SERVICE_KEY } from "../storage/interfaces/story-storage.service";

const SimpleParseArrayPipe = new ParseArrayPipe({
  separator: ",",
  items: Number,
  optional: true,
});

@Controller("stories")
export class StoryController {
  constructor(
    private readonly storyService: StoryService,
    @Inject(forwardRef(() => ReadingHistoryService)) private readingHistoryService: ReadingHistoryService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(STORY_STORAGE_SERVICE_KEY)
    private storyStorageService: IStoryStorageService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getStories(
    @Query("page") page,
    @Query("skip") skip,
    @Query("limit") limit,
    @Query("category") category: StoryCategory,
    @Query("ids", SimpleParseArrayPipe) ids: number[],
    @Query("search") search: string,
    @Query("genres", SimpleParseArrayPipe) genres: number[],
    @Query("authors", SimpleParseArrayPipe) authors: number[],
    @Req() req,
  ): Promise<PaginationResult<GetStoryDto> | GetStoryDto[] | StorySearchBody[]> {
    limit = toInt(limit);
    const pagination = {
      page: toInt(page),
      skip: toInt(skip),
      limit: limit > 100 ? 100 : limit,
    };

    const imGod = isGod(req);
    const isDefinedArray = (arr: number[]) => !!arr && arr.length > 0;

    switch (category) {
      case "spotlight":
      // TODO: implement spotlight
      case "suggestions":
      // TODO: implement spotlight
      case "new":
      // TODO: implement spotlight
      case "recommend":
      // TODO: implement spotlight
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
        if (isDefinedArray(ids)) {
          const result = await this.storyService.getStoriesByIds(ids);
          if (imGod) {
            return result;
          }
          const unpublishedStory = result.find((item) => !item.published);
          if (unpublishedStory) {
            throw new ForbiddenException(`Story ${unpublishedStory.id} isn't published yet`);
          }
          return result;
        }

        if (isDefinedArray(genres)) {
          return this.storyService.getStoriesByGenres(genres, pagination, imGod);
        }

        if (isDefinedArray(authors)) {
          return this.storyService.getStoriesByAuthors(authors, pagination, imGod);
        }

        if (search) {
          return await this.storyService.search(search.trim());
        }
        return [];
    }
  }

  @Get(":idOrSlug")
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getStory(@Param("idOrSlug") idOrSlug: string | number, @Req() req): Promise<GetStoryDto | boolean> {
    const storyData = this.isSlug(idOrSlug)
      ? await this.storyService.getStoryByUrl(idOrSlug)
      : await this.storyService.getStory(idOrSlug);

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
  async updateStory(
    @Param("id", ParseIntPipe) id: number,
    @Body() story: UpdateStoryDto,
    @Req() req,
  ): Promise<GetStoryDto> {
    if (isNumber(story.title)) {
      throw new BadRequestException("Story title can't only contain numbers");
    }
    const currentStory = await this.getAndCheckStoryPermission(id, req);
    const storyData = await this.storyService.updateStory(currentStory, story, req.user);
    return this.storyService.toDto(storyData);
  }

  private async getAndCheckStoryPermission(id: number, req): Promise<Story> {
    const story = await this.storyService.getStory(id);
    if (!story) {
      throw new NotFoundException();
    }

    if (!isOwnerOrGod(req, story)) {
      throw new ForbiddenException();
    }

    return story;
  }

  @Delete(":id")
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async deleteStory(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const story = await this.getAndCheckStoryPermission(id, req);
    await this.storyService.deleteStory(story.id);
  }

  @Put(":id/cover")
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor("file"))
  async updateCover(@Param("id", ParseIntPipe) id: number, @UploadedFile() file: BufferedFile, @Req() req) {
    const story = await this.getAndCheckStoryPermission(id, req);
    const uploadedData = await this.storyStorageService.upload(file, id);
    story.thumbnail = uploadedData.thumbnail;
    story.cover = uploadedData.cover;
    await this.storyService.updateStory(story, story, req.user);
    return this.storyService.toDto(story);
  }

  @Delete(":id/cover")
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor("file"))
  async deleteCover(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const story = await this.getAndCheckStoryPermission(id, req);
    await this.storyStorageService.remove(id);
    story.thumbnail = "";
    story.cover = "";
    await this.storyService.updateStory(story, story, req.user);
    return this.storyService.toDto(story);
  }
}
