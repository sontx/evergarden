import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { GetAuthorDto } from '../author/get-author.dto';
import { GetGenreDto } from '../genre/get-genre.dto';
import { StoryStatus } from './story-status';
import { StoryType } from './story-type';

export class UpdateStoryDto {
  @MinLength(4)
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @Matches(/ongoing|full/s)
  status?: StoryStatus;

  @IsString()
  @IsOptional()
  @Matches(/convert|translate|self-composed/s)
  type?: StoryType;

  @IsArray()
  @IsOptional()
  authors?: GetAuthorDto[];

  @IsArray()
  @IsOptional()
  genres?: GetGenreDto[];

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
