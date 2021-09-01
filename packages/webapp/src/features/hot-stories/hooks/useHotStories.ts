import api from "../../../utils/api";
import { GetStoryDto, PaginationResult } from "@evergarden/shared";
import { UseInfiniteQueryOptions } from "react-query";
import { useInfinitePageQuery } from "../../../hooks/useInfinitePageQuery";

async function fetchHotStories(
  skip: number,
  limit: number,
): Promise<GetStoryDto[]> {
  const response = await api.get<PaginationResult<GetStoryDto>>(
    "/api/stories",
    {
      params: { skip, limit, category: "hot" },
    },
  );
  return response.data.items;
}

export default function useHotStories(
  queryKey: unknown[],
  options?: UseInfiniteQueryOptions<GetStoryDto[]>,
) {
  const [page] = queryKey;
  return useInfinitePageQuery(["hot-stories", page], fetchHotStories, options);
}
