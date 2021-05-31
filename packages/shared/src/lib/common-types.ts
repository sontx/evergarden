import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class Auth2Body {
  @IsString()
  token: string;
}

export interface AuthUser {
  id: IdType;
  email: string;
  fullName: string;
  photoUrl: string;
  historyId: IdType;
  settings: GetUserSettingsDto;
}

export interface GetUserDto {
  id: IdType;
  email?: string;
  fullName: string;
  photoUrl?: string;
}

export type SizeType = 'S' | 'M' | 'L' | 'XL';

export interface GetUserSettingsDto {
  readingFontSize: SizeType;
  readingFont: string;
  readingLineSpacing: SizeType;
}

export class UpdateUserSettingsDto {
  @IsString()
  @Matches(/S|M|L|XL/s)
  readingFontSize: string;

  @IsString()
  readingFont: string;

  @IsString()
  @Matches(/S|M|L|XL/s)
  readingLineSpacing: string;
}

export interface JwtPayload {
  id: IdType;
  email: string;
  role: Role;
  historyId: IdType;
}

export type IdType = string | number;

export type Role = 'guest' | 'user' | 'mod' | 'admin';

export type StoryStatus = 'ongoing' | 'full';

export interface Author {
  id: string;
  name: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface GetStoryDto {
  id: IdType;
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
  status: StoryStatus;
  authors?: Author[];
  genres?: Genre[];
  created: Date;
  updated: Date;
  view: number;
  upvote: number;
  downvote: number;
  lastChapter: number;
  published?: boolean;
  uploadBy: IdType | GetUserDto;
  updatedBy: IdType | GetUserDto;

  history?: GetStoryHistoryDto;
}

export class CreateStoryDto {
  @IsOptional()
  @MinLength(4)
  @IsString()
  url?: string;

  @MinLength(4)
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  thumbnail?: string;

  @IsString()
  @Matches(/ongoing|full/s)
  status: StoryStatus;

  @IsArray({ each: true })
  @IsOptional()
  authors?: Author[];

  @IsArray({ each: true })
  @IsOptional()
  genres?: Author[];

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export type UpdateStoryDto = Omit<CreateStoryDto, 'url'>;

export class GetChapterDto {
  id: IdType;
  storyId: IdType;
  chapterNo: number;
  title?: string;
  created: Date;
  updated: Date;
  uploadBy: IdType | GetUserDto;
  updatedBy: IdType | GetUserDto;
  published?: boolean;
  content: string;
}

export class CreateChapterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @MinLength(7)
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export type UpdateChapterDto = CreateChapterDto;

export interface PaginationOptions {
  page: number;
  skip?: number;
  limit: number;
}

export interface PaginationResult<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export type StoryCategory = 'updated' | 'hot' | 'following';
export type VoteType = 'upvote' | 'downvote' | 'none';

export interface GetStoryHistoryDto {
  id: IdType;
  storyId: IdType;
  currentChapterNo: number;
  started: Date;
  lastVisit: Date;
  currentReadingPosition?: number;
  vote: VoteType;
  isFollowing: boolean;
}

export class UpdateStoryHistoryDto {
  @IsString()
  @IsMongoId()
  storyId: IdType;

  @Min(0)
  @IsOptional()
  currentChapterNo?: number;

  @Min(0)
  @IsOptional()
  currentReadingPosition?: number;

  @IsString()
  @IsOptional()
  @Matches(/upvote|downvote|none/s)
  vote?: VoteType;

  @IsOptional()
  @IsBoolean()
  isFollowing?: boolean;
}

export interface StorySearchBody {
  id: IdType;
  title: string;
  url: string;
  description?: string;
  thumbnail: string;
}

export interface StorySearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: StorySearchBody;
    }>;
  };
}
