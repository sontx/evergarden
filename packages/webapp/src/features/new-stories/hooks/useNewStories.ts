import api from "../../../utils/api";
import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import { UseInfiniteQueryOptions } from "react-query";
import { useInfinitePageQuery } from "../../../hooks/useInfinitePageQuery";

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
  queryKey: unknown[],
  options?: UseInfiniteQueryOptions<GetStoryDto[]>,
) {
  const [page, max] = queryKey;
  return useInfinitePageQuery(
    [page],
    (skip, limit) =>
      fetchNewStories(skip, max === undefined ? limit : (max as number)),
    options,
  );
}
