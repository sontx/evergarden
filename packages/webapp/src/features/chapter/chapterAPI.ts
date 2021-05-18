import { GetChapterDto, IdType } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchChapter(
  storyId: IdType,
  chapterNo: number,
  searchById: boolean,
): Promise<GetChapterDto> {
  const response = await api.get(
    `/api/stories/${storyId}/chapters/${chapterNo}`,
    { params: { searchById } },
  );
  return response.data;
}
