import { GetStoryDto } from './get-story.dto';

export interface GetStoryTrendingDto extends GetStoryDto {
  score: number;
}
