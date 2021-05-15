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
  ValidationPipe
} from "@nestjs/common";
import { StoryService } from "./story.service";
import {
  CreateStoryDto,
  GetStoryDto,
  PaginationResult
} from "@evergarden/shared";
import JwtGuard from "../auth/jwt/jwt.guard";
import { Role } from "../auth/role/roles.decorator";
import {RolesGuard} from "../auth/role/roles.guard";

@Controller("stories")
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get("last-updated")
  async getLastUpdated(
    @Query("page", ParseIntPipe) page = 1,
    @Query("limit", ParseIntPipe) limit = 10,
  ): Promise<PaginationResult<GetStoryDto>> {
    await new Promise(resolve => setTimeout(() => resolve(null), 5000));
    return await this.storyService.getLastUpdatedStories({
      page,
      limit: limit > 100 ? 100 : limit,
    });
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @Role("admin")
  @UseGuards(JwtGuard, RolesGuard)
  addStory(@Body() story: CreateStoryDto, @Req() req): Promise<GetStoryDto> {
    return this.storyService.addStory(story, req.user);
  }
}
