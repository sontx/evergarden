import { IsOptional, IsString, Matches } from 'class-validator';
import { SizeType } from './get-user-settings.dto';

export class UpdateUserSettingsDto {
  @IsString()
  @IsOptional()
  @Matches(/S|M|L|XL/s)
  readingFontSize?: SizeType;

  @IsString()
  @IsOptional()
  readingFont?: string;

  @IsString()
  @IsOptional()
  @Matches(/S|M|L|XL/s)
  readingLineSpacing?: SizeType;
}
