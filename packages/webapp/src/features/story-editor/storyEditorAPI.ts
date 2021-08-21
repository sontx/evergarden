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

export async function updateStoryCover(
  storyId: number,
  file: File,
): Promise<{ thumbnail: string; cover: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.put(`/api/stories/${storyId}/cover`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function deleteStoryCover(id: number): Promise<GetStoryDto> {
  const response = await api.delete(`/api/stories/${id}/cover`);
  return response.data;
}
