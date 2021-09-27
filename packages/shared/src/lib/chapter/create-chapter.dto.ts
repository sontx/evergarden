import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

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
