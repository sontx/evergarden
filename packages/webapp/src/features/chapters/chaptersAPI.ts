import { GetChapterDto, PaginationResult } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchChapters(
  storyId: number,
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

export async function fetchRangeChapters(
  storyId: number,
  skip: number,
  limit: number,
  sort: string,
): Promise<PaginationResult<GetChapterDto>> {
  const response = await api.get(`/api/stories/${storyId}/chapters`, {
    params: {
      skip,
      limit,
      includesContent: false,
      sort,
    },
  });
  return response.data;
}
