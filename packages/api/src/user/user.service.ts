import { GetUserDto, IdType } from "@evergarden/shared";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { ReadingHistoryService } from "../reading-history/reading-history.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => ReadingHistoryService))
    private readingHistoryService: ReadingHistoryService,
  ) {}

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async getById(id: IdType): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  toDto(user: User): GetUserDto {
    return (
      user && {
        id: user.id.toHexString(),
        fullName: user.fullName,
      }
    );
  }

  async addUser(user: Partial<User>): Promise<User> {
    const newUser = await this.userRepository.create(user);
    const history = await this.readingHistoryService.createEmptyReadingHistory();
    try {
      newUser.historyId = history.id.toHexString();
    } finally {
      await this.readingHistoryService.deleteReadingHistory(history.id.toHexString());
    }
    await this.userRepository.save(newUser);
    return newUser;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: IdType) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: IdType): Promise<User | undefined> {
    const user = await this.getById(userId);
    if (!user || !user.refreshToken || !refreshToken) {
      return null;
    }
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: IdType) {
    return this.userRepository.update(userId, {
      refreshToken: null,
    });
  }

  updateUser({ id, ...rest }: User) {
    return this.userRepository.update(id as any, rest);
  }
}
