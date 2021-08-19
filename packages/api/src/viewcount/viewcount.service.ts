import { Injectable } from "@nestjs/common";
import { DelayedQueueService } from "../common/delayed-queue.service";
import { Story } from "../story/story.entity";
import { Connection } from "typeorm";

@Injectable()
export class ViewcountService extends DelayedQueueService<number> {
  constructor(private connection: Connection) {
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
    }
  }

  protected onMerge(current: any, newValue: any): any {
    if (typeof current === "number") {
      return current + newValue;
    }
    return newValue;
  }
}
