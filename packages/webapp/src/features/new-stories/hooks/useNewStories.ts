import api from "../../../utils/api";
import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import { useQuery, UseQueryOptions } from "react-query";

const MAX_STORIES = 10;

async function fetchNewStories(
  skip: number,
  limit: number,
): Promise<GetStoryDto[]> {
  const response = await api.get<PaginationResult<GetStoryDto>>(
    "/api/stories",
    {
      params: { skip, limit, category: "new" },
    },
  );
  return response.data.items;
}

export default function useNewStories(
  page: number,
  max?: number,
  options?: UseQueryOptions<GetStoryDto[]>,
) {
  const maxStories = max !== undefined ? max : MAX_STORIES;
  return useQuery<GetStoryDto[]>(
    ["new-stories", page],
    () => fetchNewStories(page * maxStories, maxStories),
    options,
  );
}
