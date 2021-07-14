import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Story } from "./story.entity";
import { Repository } from "typeorm";
import { DelayedQueueService } from "../common/delayed-queue.service";

@Injectable()
export class ViewCountService extends DelayedQueueService {
  constructor(@InjectRepository(Story) private storyRepository: Repository<Story>) {
    super();
  }

  protected async onExecute(id: number, value: number): Promise<void> {
    await this.storyRepository
      .createQueryBuilder()
      .update(Story)
      .whereInIds(id)
      .set({ view: () => `view + ${value}` })
      .execute();
  }

  protected onMerge(current: any, newValue: any): any {
    return (current || 0) + newValue;
  }
}
