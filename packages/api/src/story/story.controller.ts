import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { StoryService } from "./story.service";
import { CreateStoryDto, GetStoryDto, PaginationResult, StoryCategory } from "@evergarden/shared";
import JwtGuard from "../auth/jwt/jwt.guard";
import { Role } from "../auth/role/roles.decorator";
import { RolesGuard } from "../auth/role/roles.guard";
import { Role as RoleType } from "@evergarden/shared";

@Controller("stories")
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get()
  async getLastUpdated(
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
    const role = req.user && (req.user.role as RoleType);
    const includeUnpublished = (role && role === "mod") || role === "admin";

    if (category === "updated") {
      return await this.storyService.getLastUpdatedStories(pagination, includeUnpublished);
    } else if (category === "hot") {
      return await this.storyService.getHotStories(pagination, includeUnpublished);
    }

    return this.storyService.getStories(pagination, undefined, includeUnpublished);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  addStory(@Body() story: CreateStoryDto, @Req() req): Promise<GetStoryDto> {
    return this.storyService.addStory(story, req.user);
  }
}
