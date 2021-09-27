export type SizeType = 'S' | 'M' | 'L' | 'XL';

export interface GetUserSettingsDto {
  readingFontSize: SizeType;
  readingFont: string;
  readingLineSpacing: SizeType;
}
