import {
  GetStoryDto,
  PaginationResult,
  StoryCategory,
} from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchStories(
  skip: number,
  limit: number,
  category: StoryCategory,
): Promise<PaginationResult<GetStoryDto>> {
  const response = await api.get("/api/stories", {
    params: { skip, limit, category: category },
  });
  return response.data;
}

export async function fetchStoriesByIds(ids: number[]): Promise<GetStoryDto[]> {
  const response = await api.get("/api/stories", {
    params: {
      ids,
    },
  });
  return response.data;
}
