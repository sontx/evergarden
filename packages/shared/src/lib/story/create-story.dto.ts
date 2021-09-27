import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { StoryStatus } from './story-status';
import { StoryType } from './story-type';
import { GetAuthorDto } from '../author/get-author.dto';
import { GetGenreDto } from '../genre/get-genre.dto';

export class CreateStoryDto {
  @IsOptional()
  @MinLength(4)
  @IsString()
  @Matches(/[a-zA-Z]/s)
  slug?: string;

  @MinLength(4)
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @Matches(/ongoing|full/s)
  status: StoryStatus;

  @IsString()
  @Matches(/convert|translate|self-composed/s)
  type: StoryType;

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
