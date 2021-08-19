import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadingHistory } from "./reading-history.entity";
import { UserService } from "../user/user.service";
import { StoryService } from "../story/story.service";

@Injectable()
export class ReadingHistoryService {
  constructor(
    @InjectRepository(ReadingHistory) private readingHistoryRepository: Repository<ReadingHistory>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => StoryService))
    private storyService: StoryService,
  ) {}

  async deleteReadingHistory(id: number) {
    await this.readingHistoryRepository.delete(id);
  }

  async getStoryHistory(userId: number, storyId: number): Promise<ReadingHistory> {
    return await this.readingHistoryRepository.findOne({ where: { userId, storyId } });
  }

  async getReadingHistories(userId: number): Promise<ReadingHistory[]> {
    const user = await this.userService.getById(userId);
    return await user.histories;
  }
}
