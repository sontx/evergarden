import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ReadingHistoryService } from "./reading-history.service";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { Role } from "../auth/role/roles.decorator";
import { StoryService } from "../story/story.service";
import { UpdateReadingHistoryDto } from "@evergarden/shared";

@Controller("histories")
export class ReadingHistoryController {
  constructor(private readingHistoryService: ReadingHistoryService, private storyService: StoryService) {}

  @Get(":historyId/:storyId")
  @UseGuards(JwtGuard, RolesGuard)
  @Role("user")
  async getStoryHistory(@Param("storyId", ParseIntPipe) storyId: number, @Req() req) {
    const { id } = req.user;
    const history = this.readingHistoryService.getStoryHistory(id, storyId);
    if (!history) {
      throw new NotFoundException();
    }
    return history;
  }

  @Put()
  @UseGuards(JwtGuard, RolesGuard)
  @Role("user")
  async updateStoryHistory(@Req() req, @Body() storyHistory: UpdateReadingHistoryDto) {
    const { id } = req.user || {};
    if (!id) {
      throw new UnauthorizedException();
    }

    await this.readingHistoryService.updateStoryHistory(id, storyHistory);
    // TODO: calculate new reading count
  }
}
