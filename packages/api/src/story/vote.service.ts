import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Story } from "./story.entity";
import { Repository } from "typeorm";
import { DelayedQueueService } from "../common/delayed-queue.service";

@Injectable()
export class VoteService extends DelayedQueueService<number> {
  constructor(@InjectRepository(Story) private storyRepository: Repository<Story>) {
    super();
  }

  protected async onExecute(id: number, { upvote, downvote }: { upvote: number; downvote: number }): Promise<void> {
    await this.storyRepository.manager.transaction(async (entityManager) => {
      const currentStory = await entityManager.findOne(Story, id);
      if (!currentStory) {
        return;
      }

      const query = entityManager.createQueryBuilder().update(Story).whereInIds(id);

      let changed = {};
      if (upvote !== 0) {
        if (upvote + currentStory.upvote > 0) {
          changed = { upvote: () => this.buildSentence("upvote", upvote) };
        } else {
          changed = { upvote: 0 };
        }
      }

      if (downvote !== 0) {
        if (downvote + currentStory.downvote > 0) {
          changed = {...changed, downvote: () => this.buildSentence("downvote", downvote)}
        } else {
          changed = {...changed, downvote: 0};
        }
      }

      await query.set(changed).execute();
    });
  }

  private buildSentence(prop: string, value: number): string {
    return value > 0 ? `${prop} + ${value}` : `${prop} - ${Math.abs(value)}`;
  }

  protected onMerge(current: any, newValue: any): any {
    const { upvote: oldUpvote, downvote: oldDownvote } = current || {
      upvote: 0,
      downvote: 0,
    };
    const { upvote: newUpvote, downvote: newDownvote } = newValue;
    return { upvote: oldUpvote + newUpvote, downvote: oldDownvote + newDownvote };
  }
}
