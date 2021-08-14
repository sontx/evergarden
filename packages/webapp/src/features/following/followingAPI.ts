import { GetStoryDto } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchFollowingStories(
  ids: number[],
): Promise<GetStoryDto[]> {
  const response = await api.get("/api/stories", {
    params: {
      ids,
    },
  });
  return response.data;
}
