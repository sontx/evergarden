import {
  CreateChapterDto,
  GetChapterDto,
  IdType,
  UpdateChapterDto,
} from "@evergarden/shared";
import api from "../../utils/api";

export async function createChapter(
  storyId: IdType,
  chapter: CreateChapterDto,
): Promise<GetChapterDto> {
  const response = await api.post(`/api/stories/${storyId}/chapters`, chapter);
  return response.data;
}

export async function updateChapter(
  storyId: IdType,
  chapter: UpdateChapterDto,
): Promise<GetChapterDto> {
  const response = await api.put(`/api/stories/${storyId}/chapters`, chapter);
  return response.data;
}
