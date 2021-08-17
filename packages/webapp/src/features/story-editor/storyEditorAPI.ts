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

export async function uploadThumbnail(
  storyId: number,
  file: File,
): Promise<{ thumbnail: string; cover: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post(`/api/storage/stories/${storyId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
