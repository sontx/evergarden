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
  updated: Date;
  view: number;
  rating?: number;
  lastChapter?: number;
  published?: boolean;
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
