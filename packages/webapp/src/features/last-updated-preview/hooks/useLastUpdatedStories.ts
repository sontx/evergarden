import api from "../../../utils/api";
import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import { useQuery, UseQueryOptions } from "react-query";

const MAX_STORIES = 10;

async function fetchLastUpdatedStories(
  skip: number,
  limit: number,
): Promise<GetStoryDto[]> {
  const response = await api.get<PaginationResult<GetStoryDto>>("/api/stories", {
    params: { skip, limit, category: "updated" },
  });
  return response.data.items;
}

export default function useLastUpdatedStories(
  page: number,
  options?: UseQueryOptions<GetStoryDto[]>,
) {
  return useQuery<GetStoryDto[]>(
    ["last-updated", page],
    () => fetchLastUpdatedStories(page * MAX_STORIES, MAX_STORIES),
    options,
  );
}
