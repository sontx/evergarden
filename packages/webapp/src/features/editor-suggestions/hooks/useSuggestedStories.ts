import api from "../../../utils/api";
import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import { UseQueryOptions } from "react-query";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";

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
  return useSimpleQuery<GetStoryDto[]>(
    ["suggested-stories"],
    () => fetchSuggestedStories(),
    options,
  );
}
