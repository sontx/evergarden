import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { ReadingHistoryModule } from "../reading-history/reading-history.module";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), ReadingHistoryModule, StorageModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
