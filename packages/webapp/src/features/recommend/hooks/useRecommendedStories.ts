import api from "../../../utils/api";
import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import { useQuery, UseQueryOptions } from "react-query";

async function fetchRecommendedStories(): Promise<GetStoryDto[]> {
  const response = await api.get<PaginationResult<GetStoryDto>>(
    "/api/stories",
    {
      params: { limit: 10, category: "recommend" },
    },
  );
  return response.data.items;
}

export default function useRecommendedStories(
  options?: UseQueryOptions<GetStoryDto[]>,
) {
  return useQuery<GetStoryDto[]>(
    ["recommended-stories"],
    () => fetchRecommendedStories(),
    options,
  );
}
