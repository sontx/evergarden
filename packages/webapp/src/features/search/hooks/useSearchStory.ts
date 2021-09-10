import api from "../../../utils/api";
import { StorySearchBody } from "@evergarden/shared";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import ms from "ms";

async function searchStories(text: string): Promise<StorySearchBody[]> {
  const response = await api.get("/api/stories", { params: { search: text } });
  return response.data;
}

export function useSearchStory(query: string) {
  const queryValue = query.trim().toLowerCase();
  return useSimpleQuery(
    ["search", queryValue],
    () => (!query ? Promise.resolve([]) : searchStories(queryValue)),
    {
      staleTime: ms("10s"),
      cacheTime: ms("15s"),
      enabled: !!queryValue,
    },
  );
}
