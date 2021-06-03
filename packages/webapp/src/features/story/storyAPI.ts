import { GetStoryDto, IdType } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchStory(id: IdType): Promise<GetStoryDto> {
  const response = await api.get(`/api/stories/${id}`, {
    params: { url: false },
  });
  return response.data;
}

export async function fetchStoryByUrl(url: string): Promise<GetStoryDto> {
  const response = await api.get(`/api/stories/${url}`, {
    params: { url: true, check: false },
  });
  return response.data;
}
