import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchUserStories(): Promise<
  PaginationResult<GetStoryDto>
> {
  const response = await api.get("/api/stories", {
    params: { category: "user" },
  });
  return response.data;
}

export async function deleteUserStory(id: number): Promise<void> {
  await api.delete(`/api/stories/${id}`);
}
