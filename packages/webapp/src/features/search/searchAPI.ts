import { StorySearchBody } from "@evergarden/shared";
import api from "../../utils/api";

export async function searchStories(
  text: string,
): Promise<StorySearchBody[]> {
  const response = await api.get("/api/stories", { params: { search: text } });
  return response.data;
}
