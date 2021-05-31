import {GetStoryDto, PaginationResult, StoryCategory} from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchLastUpdatedStories(page: number, limit: number): Promise<PaginationResult<GetStoryDto>> {
  const response = await api.get("/api/stories", { params: { page, limit, category: "updated" } });
  return response.data;
}

export async function fetchStories(page: number, limit: number, category: StoryCategory): Promise<PaginationResult<GetStoryDto>> {
  const response = await api.get("/api/stories", { params: { page, limit, category: category } });
  return response.data;
}
