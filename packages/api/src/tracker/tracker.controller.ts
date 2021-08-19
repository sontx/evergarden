import { Controller, ParseIntPipe, Post, Query, Req } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TrackerReceivedEvent } from "../events/tracker-received.event";

@Controller("tracker")
export class TrackerController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Post()
  postTrack(@Query("storyId", ParseIntPipe) storyId: number, @Req() req) {
    this.eventEmitter
      .emitAsync(TrackerReceivedEvent.name, new TrackerReceivedEvent(storyId, req.sessionID, new Date()))
      .then();
  }
}
