import { GetStoryDto } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchStory(idOrSlug: string | number): Promise<GetStoryDto> {
  const response = await api.get(`/api/stories/${idOrSlug}`);
  return response.data;
}
