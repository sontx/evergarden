import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchLastUpdatedStories(page: number, limit: number): Promise<PaginationResult<GetStoryDto>> {
  const response = await api.get("/api/stories/last-updated", { params: { page, limit } });
  return response.data;
}
