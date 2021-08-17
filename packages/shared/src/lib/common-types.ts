import {
  IsArray,
  IsBoolean,
  IsEmail, IsJWT, IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export type OAuth2Provider = 'google' | 'facebook';

export class UserPass {
  @IsEmail()
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(25)
  password: string;
}

export class Auth2Body {
  @IsJWT()
  token: string;

  @IsString()
  @Matches(/google|facebook/s)
  provider: OAuth2Provider;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  photoUrl: string;
  settings: GetUserSettingsDto;
}

export interface GetUserDto {
  id: number;
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
  id: number;
  email: string;
  role: Role;
}

export type Role = 'guest' | 'user' | 'mod' | 'admin';

export type StoryStatus = 'ongoing' | 'full';

export interface GetAuthorDto {
  id: number;
  name: string;
}

export interface GetGenreDto {
  id: number;
  name: string;
}

export interface GetStoryDto {
  id: number;
  url: string;
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

  history?: GetReadingHistoryDto;
}

export class CreateStoryDto {
  @IsOptional()
  @MinLength(4)
  @IsString()
  @Matches(/[a-zA-Z]/s)
  url?: string;

  @MinLength(4)
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsString()
  @Matches(/ongoing|full/s)
  status: StoryStatus;

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

export class UpdateStoryDto {
  @MinLength(4)
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsString()
  @IsOptional()
  @Matches(/ongoing|full/s)
  status?: StoryStatus;

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

export class GetChapterDto {
  id: number;
  storyId: number;
  chapterNo: number;
  title?: string;
  created: Date;
  updated: Date;
  createdBy: GetUserDto;
  updatedBy: GetUserDto;
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

export class UpdateChapterDto extends CreateChapterDto {
}

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

export type StoryCategory = 'updated' | 'hot' | 'user';
export type VoteType = 'upvote' | 'downvote' | 'none';

export interface GetReadingHistoryDto {
  id: number;
  storyId: number;
  currentChapterNo: number;
  started: Date;
  lastVisit: Date;
  currentReadingPosition?: number;
  vote: VoteType;
  isFollowing: boolean;
}

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
}

export interface StorySearchBody {
  id: number;
  title: string;
  url: string;
  description?: string;
  thumbnail: string;
}

export interface SearchResult<T> {
  hits: {
    total: number;
    hits: Array<{
      _source: T;
    }>;
  };
}

export interface AuthorSearchBody {
  id: number;
  name: string;
}

export interface ThumbnailUploadResponse {
  tempFileName: string;
}
