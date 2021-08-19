import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Put, Req, UseGuards } from "@nestjs/common";
import { ReadingHistoryService } from "./reading-history.service";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { Role } from "../auth/role/roles.decorator";
import { UpdateReadingHistoryDto } from "@evergarden/shared";
import { ReadingHistory } from "./reading-history.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtConfig } from "../auth/jwt/jwt-config.decorator";
import { HistoryChangedEvent } from "../events/history-changed.event";

@Controller("histories")
export class ReadingHistoryController {
  constructor(private readingHistoryService: ReadingHistoryService, private eventEmitter: EventEmitter2) {}

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Role("user")
  async getReadingHistories(@Req() req): Promise<ReadingHistory[]> {
    const { id } = req.user;
    const history = await this.readingHistoryService.getReadingHistories(id);
    if (!history) {
      throw new NotFoundException();
    }
    return history;
  }

  @Get(":storyId")
  @UseGuards(JwtGuard, RolesGuard)
  @Role("user")
  async getStoryHistory(@Param("storyId", ParseIntPipe) storyId: number, @Req() req): Promise<ReadingHistory> {
    const { id } = req.user;
    const history = await this.readingHistoryService.getStoryHistory(id, storyId);
    if (!history) {
      throw new NotFoundException();
    }
    return history;
  }

  @Put()
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async updateStoryHistory(@Req() req, @Body() storyHistory: UpdateReadingHistoryDto) {
    const { id } = req.user || {};
    this.eventEmitter.emitAsync(HistoryChangedEvent.name, new HistoryChangedEvent(storyHistory, new Date(), id)).then();
  }
}
