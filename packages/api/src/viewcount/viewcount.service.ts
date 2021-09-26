import { Injectable } from "@nestjs/common";
import { DelayedQueueService } from "../common/delayed-queue.service";
import { Story } from "../story/story.entity";
import { Connection } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ViewIncreasedEvent } from "../events/view-increased.event";

@Injectable()
export class ViewcountService extends DelayedQueueService<number> {
  constructor(private connection: Connection, private eventEmitter: EventEmitter2) {
    super();
  }

  protected async onExecute(id: number, value: any): Promise<void> {
    if (typeof value === "number") {
      console.log(`Increase view count for ${id} by ${value}`);
      await this.connection
        .createQueryBuilder()
        .update(Story)
        .whereInIds(id)
        .set({ view: () => `view + ${value}` })
        .execute();
      this.eventEmitter.emitAsync(ViewIncreasedEvent.name, new ViewIncreasedEvent(id, value, new Date())).then();
    }
  }

  protected onMerge(current: any, newValue: any): any {
    if (typeof current === "number") {
      return current + newValue;
    }
    return newValue;
  }
}
