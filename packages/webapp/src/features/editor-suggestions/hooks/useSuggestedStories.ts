import api from "../../../utils/api";
import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import { useQuery, UseQueryOptions } from "react-query";

async function fetchSuggestedStories(): Promise<GetStoryDto[]> {
  const response = await api.get<PaginationResult<GetStoryDto>>(
    "/api/stories",
    {
      params: { limit: 10, category: "suggestions" },
    },
  );
  return response.data.items;
}

export default function useSuggestedStories(
  options?: UseQueryOptions<GetStoryDto[]>,
) {
  return useQuery<GetStoryDto[]>(
    ["suggested-stories"],
    () => fetchSuggestedStories(),
    options,
  );
}
