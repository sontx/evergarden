import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchLastUpdatedStories(page: number, limit: number): Promise<PaginationResult<GetStoryDto>> {
  const response = await api.get("/api/stories", { params: { page, limit, category: "updated" } });
  return response.data;
}

export async function fetchHotStories(page: number, limit: number): Promise<PaginationResult<GetStoryDto>> {
  const response = await api.get("/api/stories", { params: { page, limit, category: "hot" } });
  return response.data;
}
