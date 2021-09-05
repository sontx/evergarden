import { GetStoryDto } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchStoriesByIds(ids: number[]): Promise<GetStoryDto[]> {
  const response = await api.get("/api/stories", {
    params: {
      ids,
    },
  });
  return response.data;
}
