import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadingHistory } from "./reading-history.entity";
import { UserService } from "../user/user.service";
import { StoryService } from "../story/story.service";
import { ConfigService } from "@nestjs/config";
import { UpdateReadingHistoryDto } from "@evergarden/shared";
import { UpdateReadingHistoryService } from "./update-reading-history.service";
import { InternalUpdateReadingHistoryDto } from "./internal-update-reading-history.dto";

@Injectable()
export class ReadingHistoryService {
  constructor(
    @InjectRepository(ReadingHistory) private readingHistoryRepository: Repository<ReadingHistory>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => StoryService))
    private storyService: StoryService,
    private configService: ConfigService,
    private updateReadingService: UpdateReadingHistoryService,
  ) {}

  async deleteReadingHistory(id: number) {
    await this.readingHistoryRepository.delete(id);
  }

  async updateStoryHistory(userId: number, storyHistory: UpdateReadingHistoryDto) {
    const newHistory: InternalUpdateReadingHistoryDto = {
      ...storyHistory,
      lastVisit: new Date(),
    };
    this.updateReadingService.enqueue(userId, newHistory);
  }

  async getStoryHistory(userId: number, storyId: number): Promise<ReadingHistory> {
    return await this.readingHistoryRepository.findOne({ where: { userId, storyId } });
  }

  async getReadingHistories(userId: number): Promise<ReadingHistory[]> {
    const user = await this.userService.getById(userId);
    return await user.histories;
  }
}
