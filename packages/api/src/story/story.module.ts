import {Module} from '@nestjs/common';
import {StoryController} from './story.controller';
import {StoryService} from './story.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Story} from "./story.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Story])],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService]
})
export class StoryModule {}
