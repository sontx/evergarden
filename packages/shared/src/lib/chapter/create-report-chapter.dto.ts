import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateReportChapterDto {
  @IsString()
  @Matches(
    /wrongContent|spellingMistake|wrongChapter|wrongTranslation|chaptersAreNotDisplayed|containsSensitiveVulgarLanguage/s
  )
  type: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  detail?: string;
}
