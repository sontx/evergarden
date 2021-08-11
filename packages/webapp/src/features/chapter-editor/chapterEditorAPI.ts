import {
  CreateChapterDto,
  GetChapterDto,
  UpdateChapterDto,
} from "@evergarden/shared";
import api from "../../utils/api";

export async function createChapter(
  storyId: number,
  chapter: CreateChapterDto,
): Promise<GetChapterDto> {
  const response = await api.post(`/api/stories/${storyId}/chapters`, chapter);
  return response.data;
}

export async function updateChapter(
  storyId: number,
  chapterNo: number,
  chapter: UpdateChapterDto,
): Promise<GetChapterDto> {
  const response = await api.put(`/api/stories/${storyId}/chapters`, chapter);
  return response.data;
}
