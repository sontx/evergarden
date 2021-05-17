import { GetChapterDto, IdType, PaginationResult } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchChapters(
  storyId: IdType,
  page: number,
  limit: number,
): Promise<PaginationResult<GetChapterDto>> {
  const response = await api.get(`/api/stories/${storyId}/chapters`, {
    params: {
      page,
      limit,
      includesContent: false,
    },
  });
  return response.data;
}
