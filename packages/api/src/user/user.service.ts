import { IdType } from "@evergarden/common";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    return user;
  }

  async getById(id: IdType): Promise<User> {
    const user = await this.userRepository.findOne(id);
    return user;
  }

  async addUser(user: Partial<User>): Promise<User> {
    const newUser = await this.userRepository.create(user);
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
}
