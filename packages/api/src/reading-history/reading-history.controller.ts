import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ReadingHistoryService } from "./reading-history.service";
import { IdType, UpdateStoryHistoryDto } from "@evergarden/shared";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { Role } from "../auth/role/roles.decorator";
import { StoryService } from "../story/story.service";

@Controller("histories")
export class ReadingHistoryController {
  constructor(private readingHistoryService: ReadingHistoryService, private storyService: StoryService) {}

  @Get(":historyId/:storyId")
  @UseGuards(JwtGuard, RolesGuard)
  @Role("user")
  async getStoryHistory(@Param("historyId") historyId: IdType, @Param("storyId") storyId: IdType) {
    if (!historyId || !storyId) {
      throw new NotFoundException();
    }
    const history = this.readingHistoryService.getStoryHistory(historyId, storyId);
    if (!history) {
      throw new NotFoundException();
    }
    return history;
  }

  @Put()
  @UseGuards(JwtGuard, RolesGuard)
  @Role("user")
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateStoryHistory(
    @Query("historyId") historyId: IdType,
    @Query("startReading", ParseBoolPipe) startReading: boolean,
    @Req() req,
    @Body() storyHistory: UpdateStoryHistoryDto,
  ) {
    const { id } = req.user || {};
    if (!id) {
      throw new UnauthorizedException();
    }

    await this.readingHistoryService.updateStoryHistory(id, historyId || "", storyHistory);
    if (startReading) {
      await this.storyService.increaseCount(storyHistory.storyId);
    }
  }
}
