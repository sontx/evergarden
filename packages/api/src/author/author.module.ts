import { Module } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { AuthorController } from "./author.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Author } from "./author.entity";
import { SearchModule } from "../search/search.module";

@Module({
  imports: [TypeOrmModule.forFeature([Author]), SearchModule],
  providers: [AuthorService],
  controllers: [AuthorController],
  exports: [AuthorService],
})
export class AuthorModule {}
