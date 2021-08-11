import {
  CreateStoryDto,
  GetStoryDto,
  UpdateStoryDto,
} from "@evergarden/shared";
import api from "../../utils/api";

export async function createStory(story: CreateStoryDto): Promise<GetStoryDto> {
  const response = await api.post("/api/stories", story);
  return response.data;
}

export async function updateStory(
  id: number,
  story: UpdateStoryDto,
): Promise<GetStoryDto> {
  const response = await api.put(`/api/stories/${id}`, story);
  return response.data;
}

export async function checkStoryUrl(url: string): Promise<boolean> {
  const response = await api.get(`/api/stories/${url}`, {
    params: { url: true, check: true },
  });
  return response.data;
}
