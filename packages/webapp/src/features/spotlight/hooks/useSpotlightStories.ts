import api from "../../../utils/api";
import { GetStoryDto } from "@evergarden/shared";
import { UseQueryOptions } from "react-query";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";

async function fetchSpotlightStories(): Promise<GetStoryDto[]> {
  const response = await api.get<GetStoryDto[]>("/api/stories", {
    params: { limit: 10, category: "spotlight" },
  });
  return response.data;
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
