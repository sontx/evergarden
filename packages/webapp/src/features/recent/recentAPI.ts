import { GetStoryDto } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchRecentStories(): Promise<GetStoryDto[]> {
  const response = await api.get("/api/stories", {
    params: {
      category: "history",
      page: 0,
      limit: 99999999
    },
  });
  return response.data && response.data.items;
}
