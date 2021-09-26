import { OnEvent } from "@nestjs/event-emitter";
import { DelayedQueueService } from "../common/delayed-queue.service";
import { IHistoryChangedTrackerService } from "./interfaces/history-changed-tracker.service";
import { TrackerReceivedEvent } from "../events/tracker-received.event";
import { ConfigService } from "@nestjs/config";
import ms = require("ms");

export class StorySession {
  constructor(public readonly sessionId: string, public readonly storyId: number) {}

  toString(): string {
    return `view:${this.sessionId}:${this.storyId}`;
  }
}

export abstract class AbstractHistoryChangedTrackerService
  extends DelayedQueueService<StorySession>
  implements IHistoryChangedTrackerService {
  protected readonly viewCountIntervalInSeconds: number;

  protected constructor(configService: ConfigService) {
    super();
    this.viewCountIntervalInSeconds = ms(configService.get<string>("policy.viewCountInterval")) / 1000;
  }

  @OnEvent(TrackerReceivedEvent.name, { async: true })
  private async handleHistoryChangedEvent(event: TrackerReceivedEvent) {
    await this.enqueue(new StorySession(event.sessionId, event.storyId), { triggerAt: event.triggerAt });
  }

  protected abstract onExecute(id: StorySession, { triggerAt }: { triggerAt: Date }): Promise<void>;

  protected onMerge(current: any, newValue: any): any {
    return newValue;
  }
}
