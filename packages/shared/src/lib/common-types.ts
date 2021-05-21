import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MinLength
} from 'class-validator';

export interface AuthUser {
  id: IdType;
  email: string;
  fullName: string;
  photoUrl: string;
  settings: GetUserSettingsDto;
}

export interface GetUserDto {
  id: IdType;
  email?: string;
  fullName: string;
  photoUrl?: string;
}

export type SizeType = "S" | "M" | "L" | "XL";

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
}

export type IdType = string | number;

export type Role = 'guest' | 'user' | 'mod' | 'admin';

export type StoryStatus = 'ongoing' | 'full';

export interface GetStoryDto {
  id: IdType;
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
  status: StoryStatus;
  authors: string[];
  genres: string[];
  created: Date;
  updated: Date;
  view: number;
  rating?: number;
  lastChapter: number;
  published?: boolean;
  uploadBy: IdType;
  updatedBy: IdType;
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

  @MinLength(3, {each: true})
  authors: string[];

  @MinLength(3, {each: true})
  genres: string[];

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export type UpdateStoryDto = Omit<CreateStoryDto, "url">;

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

export type StoryCategory = "updated" | "hot";
