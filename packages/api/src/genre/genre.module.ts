import { Module } from "@nestjs/common";
import { GenreService } from "./genre.service";
import { GenreController } from "./genre.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Genre } from "./genre.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  providers: [GenreService],
  controllers: [GenreController],
  exports: [GenreService]
})
export class GenreModule {}
