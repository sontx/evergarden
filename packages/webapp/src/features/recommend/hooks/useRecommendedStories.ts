import api from "../../../utils/api";
import { GetStoryDto } from "@evergarden/shared";
import { UseQueryOptions } from "react-query";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";

async function fetchRecommendedStories(): Promise<GetStoryDto[]> {
  const response = await api.get<GetStoryDto[]>("/api/stories", {
    params: { limit: 10, category: "recommend" },
  });
  return response.data;
}

export default function useRecommendedStories(
  options?: UseQueryOptions<GetStoryDto[]>,
) {
  return useSimpleQuery<GetStoryDto[]>(
    ["recommended-stories"],
    () => fetchRecommendedStories(),
    options,
  );
}
