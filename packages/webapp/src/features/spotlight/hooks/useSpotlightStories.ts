import api from "../../../utils/api";
import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import { UseQueryOptions } from "react-query";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";

async function fetchSpotlightStories(): Promise<GetStoryDto[]> {
  const response = await api.get<PaginationResult<GetStoryDto>>(
    "/api/stories",
    {
      params: { limit: 10, category: "spotlight" },
    },
  );
  return response.data.items;
}

export default function useSpotlightStories(
  options?: UseQueryOptions<GetStoryDto[]>,
) {
  return useSimpleQuery<GetStoryDto[]>(
    ["spotlight-stories"],
    () => fetchSpotlightStories(),
    options,
  );
}
