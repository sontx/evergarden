import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { VoteType } from '../story/vote-type';

export class UpdateReadingHistoryDto {
  @IsNumber()
  storyId: number;

  @Min(0)
  @IsOptional()
  @IsNumber()
  currentChapterNo?: number;

  @Min(0)
  @IsOptional()
  @IsNumber()
  currentReadingPosition?: number;

  @IsString()
  @IsOptional()
  @Matches(/upvote|downvote|none/s)
  vote?: VoteType;

  @IsOptional()
  @IsBoolean()
  isFollowing?: boolean;

  @IsOptional()
  @IsDateString()
  date?: string;
}
