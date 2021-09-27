import { GetAuthorDto } from '../author/get-author.dto';
import { GetGenreDto } from '../genre/get-genre.dto';
import { GetUserDto } from '../user/get-user.dto';
import { StoryStatus } from './story-status';
import { StoryType } from './story-type';
import { GetReadingHistoryDto } from '../reading-history/get-reading-history.dto';

export interface GetStoryDto {
  id: number;
  slug: string;
  title: string;
  description?: string;
  thumbnail?: string;
  cover?: string;
  status: StoryStatus;
  authors?: GetAuthorDto[];
  genres?: GetGenreDto[];
  created: Date;
  updated: Date;
  view: number;
  upvote: number;
  downvote: number;
  lastChapter?: number;
  published?: boolean;
  createdBy: GetUserDto;
  updatedBy: GetUserDto;
  type: StoryType;
  history?: GetReadingHistoryDto;
}
