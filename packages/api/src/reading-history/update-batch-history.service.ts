import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { DelayedQueueService } from "../common/delayed-queue.service";
import { ReadingHistory } from "./reading-history.entity";
import { Connection } from "typeorm";
import { UserService } from "../user/user.service";
import { StoryService } from "../story/story.service";
import { calculateVoteCount, VoteType } from "@evergarden/shared";
import { ConfigService } from "@nestjs/config";
import { VoteService } from "../story/vote.service";
import { HistoryChangedEvent } from "../events/history-changed.event";
import { OnEvent } from "@nestjs/event-emitter";
import { UpdateReadingHistoryDto } from "@evergarden/shared";

class HistoryChange extends UpdateReadingHistoryDto {
  lastVisit: Date;
}

class UserStory {
  constructor(public readonly userId: number, public readonly storyId: number) {}

  toString() {
    return `${this.userId}-${this.storyId}`;
  }
}

@Injectable()
export class UpdateBatchHistoryService extends DelayedQueueService<UserStory> {
  constructor(
    private connection: Connection,
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
    await this.enqueue(new UserStory(event.userId, event.change.storyId), {
      ...event.change,
      lastVisit: event.triggerAt,
    });
  }

  protected async onExecute(id: UserStory, value: HistoryChange): Promise<void> {
    await this.connection.transaction(async (entityManager) => {
      const { date, ...requestHistory } = value;
      const foundHistory = await entityManager.findOne(ReadingHistory, {
        where: { userId: id.userId, storyId: id.storyId },
      });
      if (foundHistory) {
        if (foundHistory.vote !== requestHistory.vote && !!requestHistory.vote) {
          await this.changeRating(requestHistory.storyId, foundHistory.vote, requestHistory.vote);
        }
        await entityManager.update(ReadingHistory, foundHistory.id, requestHistory);
      } else {
        if (requestHistory.vote) {
          await this.changeRating(requestHistory.storyId, undefined, requestHistory.vote);
        }
        const newHistory = entityManager.create(ReadingHistory, requestHistory);
        newHistory.storyId = id.storyId;
        newHistory.userId = id.userId;
        newHistory.started = requestHistory.lastVisit;
        await entityManager.save(newHistory);
      }
    });
  }

  protected onMerge(current: any, newValue: HistoryChange): any {
    if (!current) {
      return newValue;
    }

    if (newValue.date && current.date && new Date(current.date) > new Date(newValue.date)) {
      console.log("Ignored history because it's older than the current", newValue);
      return current;
    }

    return { ...current, ...newValue };
  }

  private async changeRating(storyId: number, oldVote?: VoteType, newVote?: VoteType) {
    const result = calculateVoteCount(oldVote, newVote);
    if (result) {
      await this.voteService.enqueue(storyId, result);
    }
  }
}
