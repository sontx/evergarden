import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { DelayedQueueService } from "../common/delayed-queue.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ReadingHistory } from "./reading-history.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { StoryService } from "../story/story.service";
import { calculateVoteCount, VoteType } from "@evergarden/shared";
import { ConfigService } from "@nestjs/config";
import { InternalUpdateReadingHistoryDto } from "./internal-update-reading-history.dto";
import { VoteService } from "../story/vote.service";
import { Story } from "../story/story.entity";

@Injectable()
export class UpdateReadingHistoryService extends DelayedQueueService {
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

  protected async onExecute(id: number, value: InternalUpdateReadingHistoryDto[]): Promise<void> {
    const user = await this.userService.getById(id);
    if (user) {
      await this.readingHistoryRepository.manager.transaction(async (entityManager) => {
        for (const updateItem of value) {
          if (typeof updateItem.id === "number") {
            const oldHistory = await entityManager.findOne(ReadingHistory, updateItem.id);
            if (oldHistory.vote !== updateItem.vote) {
              await this.changeRating(updateItem.storyId, oldHistory.vote, updateItem.vote);
            }
            await entityManager.update(ReadingHistory, updateItem.id, updateItem);
          } else {
            if (updateItem.vote) {
              await this.changeRating(updateItem.storyId, undefined, updateItem.vote);
            }
            const newHistory = await entityManager.create(ReadingHistory, updateItem);
            newHistory.story = entityManager.findOne(Story, updateItem.storyId);
            newHistory.user = Promise.resolve(user);
            newHistory.started = updateItem.lastVisit;
            await entityManager.save(newHistory);
          }
        }
      });
    }
  }

  protected onMerge(current: any, newValue: InternalUpdateReadingHistoryDto): any {
    if (Array.isArray(current)) {
      return this.mergeArray(current, newValue);
    }
    return this.mergeArray([current], newValue);
  }

  private mergeArray(current: InternalUpdateReadingHistoryDto[], newValue: InternalUpdateReadingHistoryDto) {
    const foundIndex = current.findIndex((item) => item.storyId === newValue.storyId);
    if (foundIndex >= 0) {
      const old = current[foundIndex];
      newValue.id = old.id;
      current[foundIndex] = newValue;
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
