import { GetPreviewChapterDto } from './get-preview-chapter.dto';
import { GetUserDto } from '../user/get-user.dto';

export class GetChapterDto extends GetPreviewChapterDto {
  storyId: number;
  updated: Date;
  createdBy: GetUserDto;
  updatedBy: GetUserDto;
  content: string;
}
