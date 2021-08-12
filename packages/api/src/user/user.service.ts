import { GetUserDto, Role, OAuth2Provider } from "@evergarden/shared";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { ReadingHistoryService } from "../reading-history/reading-history.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => ReadingHistoryService))
    private readingHistoryService: ReadingHistoryService,
    private configService: ConfigService,
  ) {}

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async getByEmailAndPassword(email: string, password: string): Promise<User> {
    return await this.userRepository.findOne({ email, password });
  }

  async getAllByRole(role: Role): Promise<User[]> {
    return await this.userRepository.find({ role });
  }

  async getOneByRoleAndProvider(role: Role, provider: OAuth2Provider | "system"): Promise<User> {
    return await this.userRepository.findOne({ role, provider });
  }

  async getById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  toDto(user: User): GetUserDto {
    return (
      user && {
        id: user.id,
        fullName: user.fullName,
      }
    );
  }

  async addUser(user: Partial<User>): Promise<User> {
    const newUser = await this.userRepository.create({
      ...user,
      settings: {
        readingFont: this.configService.get("settings.user.readingFont"),
        readingFontSize: this.configService.get("settings.user.readingFontSize"),
        readingLineSpacing: this.configService.get("settings.user.readingLineSpacing"),
      },
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User | undefined> {
    const user = await this.getById(userId);
    if (!user || !user.refreshToken || !refreshToken) {
      return null;
    }
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      refreshToken: null,
    });
  }

  updateUser({ id, ...rest }: Partial<User>) {
    return this.userRepository.update(id as any, rest);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
