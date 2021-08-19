import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { DelayedQueueService } from "../common/delayed-queue.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ReadingHistory } from "./reading-history.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { StoryService } from "../story/story.service";
import { calculateVoteCount, VoteType } from "@evergarden/shared";
import { ConfigService } from "@nestjs/config";
import { VoteService } from "../story/vote.service";
import { HistoryChangedEvent } from "../events/history-changed.event";
import { OnEvent } from "@nestjs/event-emitter";
import { UpdateReadingHistoryDto } from "@evergarden/shared/lib/common-types";

class HistoryChange extends UpdateReadingHistoryDto {
  lastVisit: Date;
}

@Injectable()
export class UpdateBatchHistoryService extends DelayedQueueService<number> {
  constructor(
    @InjectRepository(ReadingHistory) private readingHistoryRepository: Repository<ReadingHistory>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => StoryService))
    private storyService: StoryService,
    private configService: ConfigService,
    @Inject(forwardRef(() => VoteService))
    private voteService: VoteService,
  ) {
    super();
  }

  @OnEvent(HistoryChangedEvent.name, { async: true })
  async handleHistoryChangedEvent(event: HistoryChangedEvent) {
    await this.enqueue(event.userId, { ...event.change, lastVisit: event.triggerAt });
  }

  protected async onExecute(id: number, value: HistoryChange[]): Promise<void> {
    await this.readingHistoryRepository.manager.transaction(async (entityManager) => {
      for (const updateItem of value) {
        const foundHistory = await entityManager.findOne(ReadingHistory, {
          where: { userId: id, storyId: updateItem.storyId },
        });
        if (foundHistory) {
          if (foundHistory.vote !== updateItem.vote && !!updateItem.vote) {
            await this.changeRating(updateItem.storyId, foundHistory.vote, updateItem.vote);
          }
          await entityManager.update(ReadingHistory, foundHistory.id, updateItem);
        } else {
          if (updateItem.vote) {
            await this.changeRating(updateItem.storyId, undefined, updateItem.vote);
          }
          const newHistory = entityManager.create(ReadingHistory, updateItem);
          newHistory.storyId = updateItem.storyId;
          newHistory.userId = id;
          newHistory.started = updateItem.lastVisit;
          await entityManager.save(newHistory);
        }
      }
    });
  }

  protected onMerge(current: any, newValue: HistoryChange): any {
    if (!current) {
      return [newValue];
    }
    if (Array.isArray(current)) {
      return this.mergeArray(current, newValue);
    }
    return this.mergeArray([current], newValue);
  }

  private mergeArray(current: HistoryChange[], newValue: HistoryChange) {
    const foundIndex = current.findIndex((item) => item.storyId === newValue.storyId);
    if (foundIndex >= 0) {
      current[foundIndex] = { ...current[foundIndex], ...newValue };
      return current;
    }
    return [...current, newValue];
  }

  private async changeRating(storyId: number, oldVote?: VoteType, newVote?: VoteType) {
    const result = calculateVoteCount(oldVote, newVote);
    if (result) {
      await this.voteService.enqueue(storyId, result);
    }
  }
}
