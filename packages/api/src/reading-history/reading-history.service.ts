import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadingHistory, StoryHistories } from "./reading-history.entity";
import { UserService } from "../user/user.service";
import { GetStoryHistoryDto, IdType, UpdateStoryHistoryDto } from "@evergarden/shared";
import { User } from "../user/user.entity";
import { StoryService } from "../story/story.service";
import { StoryHistory } from "./story-history.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ReadingHistoryService {
  private readonly logger = new Logger(ReadingHistoryService.name);

  constructor(
    @InjectRepository(ReadingHistory) private readingHistoryRepository: Repository<ReadingHistory>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => StoryService))
    private storyService: StoryService,
    private configService: ConfigService,
  ) {}

  async createEmptyReadingHistory(): Promise<ReadingHistory> {
    let history = await this.readingHistoryRepository.create({});
    history = await this.readingHistoryRepository.save(history);
    return history;
  }

  async deleteReadingHistory(id: IdType) {
    await this.readingHistoryRepository.delete(id);
  }

  async updateStoryHistory(userId: IdType, historyId: IdType, storyHistory: UpdateStoryHistoryDto) {
    let history: ReadingHistory;
    let user: User;

    // fast getting history by its id
    if (historyId) {
      history = await this.getReadingHistory(historyId);
    }

    // didn't found? let lookup in the user
    if (!history) {
      user = await this.userService.getById(userId);
      if (user.historyId) {
        history = await this.getReadingHistory(user.historyId);
      }
    }

    // damn!! still didn't found that shit! let create a new one and update it to the current user
    if (!history) {
      const normalizedHistory = this.normalizeStoryHistory(storyHistory, null);
      await this.updateRatingIfNeeded(null, normalizedHistory);

      history = await this.readingHistoryRepository.create({
        storyHistories: {
          [normalizedHistory.storyId]: normalizedHistory,
        },
      });
      history = await this.readingHistoryRepository.save(history);

      if (user) {
        user.historyId = history.id.toHexString();
        await this.userService.updateUser(user);
      }
    } else {
      const storyHistories = history.storyHistories || {};

      const oldStoryHistory = storyHistories[storyHistory.storyId];
      const normalizedHistory = this.normalizeStoryHistory(storyHistory, oldStoryHistory);

      storyHistories[normalizedHistory.storyId] = normalizedHistory;
      const isAddNew = !oldStoryHistory;
      history.storyHistories = isAddNew ? this.removeOldHistories(storyHistories) : storyHistories;

      await this.updateRatingIfNeeded(oldStoryHistory, normalizedHistory);
      await this.readingHistoryRepository.update(history.id as any, history);
    }
  }

  private removeOldHistories(histories: StoryHistories): StoryHistories {
    const keys = Object.keys(histories);
    const maxHistoryCount = this.configService.get("settings.maxHistoryCount") || 10;

    const historyArray = keys.map((key) => histories[key]);
    const notFollowingStories = historyArray.filter((item) => !item.isFollowing);

    if (notFollowingStories.length > maxHistoryCount) {
      const followingStories = historyArray.filter((item) => item.isFollowing);
      const rebuildHistories = {};
      for (const item of followingStories) {
        rebuildHistories[item.storyId] = item;
      }

      const sortedNotFollowStories = notFollowingStories.sort((val1, val2) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return val1.lastVisit - val2.lastVisit;
      });
      const offset = notFollowingStories.length - maxHistoryCount;
      for (let i = 0; i < maxHistoryCount; i++) {
        const history = sortedNotFollowStories[i + offset];
        rebuildHistories[history.storyId] = history;
      }
      return rebuildHistories;
    }
    return histories;
  }

  private normalizeStoryHistory(
    { storyId, ...newHistory }: UpdateStoryHistoryDto,
    oldHistory: StoryHistory | null,
  ): StoryHistory {
    const current: Partial<StoryHistory> = oldHistory || {};
    const now = new Date();
    return {
      ...current,
      ...newHistory,
      storyId: current.storyId || storyId,
      currentChapterNo:
        newHistory.currentChapterNo !== undefined ? newHistory.currentChapterNo : current.currentChapterNo || 0,
      currentReadingPosition:
        newHistory.currentReadingPosition !== undefined
          ? newHistory.currentReadingPosition
          : current.currentReadingPosition || 0,
      vote: newHistory.vote !== undefined ? newHistory.vote : current.vote || "none",
      isFollowing: newHistory.isFollowing !== undefined ? newHistory.isFollowing : current.isFollowing || false,
      started: current.started || now,
      lastVisit: now,
    };
  }

  private async updateRatingIfNeeded(oldStoryHistory: StoryHistory, newStoryHistory: StoryHistory) {
    const needUpdate =
      (!oldStoryHistory && !!newStoryHistory.vote) ||
      (oldStoryHistory && oldStoryHistory.vote !== newStoryHistory.vote);
    if (needUpdate) {
      await this.storyService.changeRating(
        newStoryHistory.storyId,
        oldStoryHistory ? oldStoryHistory.vote : undefined,
        newStoryHistory.vote,
      );
    }
  }

  async getReadingHistory(historyId: IdType): Promise<ReadingHistory> {
    return await this.readingHistoryRepository.findOne(historyId);
  }

  async getStoryHistory(historyId: IdType, storyId: IdType): Promise<GetStoryHistoryDto | null> {
    const history = await this.getReadingHistory(historyId);
    if (history) {
      return (history.storyHistories || ({} as any))[storyId];
    }
    return null;
  }

  toDto(storyHistory: StoryHistory): GetStoryHistoryDto {
    return storyHistory as any;
  }
}
