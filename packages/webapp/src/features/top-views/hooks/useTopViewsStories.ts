import api from "../../../utils/api";
import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import { useQuery, UseQueryOptions } from "react-query";

const MAX_STORIES = 10;

async function fetchTopViews(
  skip: number,
  limit: number,
  type: string,
): Promise<GetStoryDto[]> {
  const response = await api.get<PaginationResult<GetStoryDto>>(
    "/api/stories",
    {
      params: { skip, limit, category: "new" },
    },
  );
  return response.data.items;
}

export default function useTopViewsStories(
  page: number,
  type: string,
  options?: UseQueryOptions<GetStoryDto[]>,
) {
  return useQuery<GetStoryDto[]>(
    ["top-view-stories", page, type],
    () => fetchTopViews(page * MAX_STORIES, MAX_STORIES, type),
    options,
  );
}
