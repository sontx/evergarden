import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";
import { GetStoryDto } from "@evergarden/shared";

const MAX_STORIES_PER_PAGE = 20;

export function useInfinitePageQuery(
  queryKey: readonly unknown[],
  queryFn: (
    skip: number,
    limit: number,
    queryKey?: readonly unknown[],
  ) => Promise<GetStoryDto[]>,
  options?: UseInfiniteQueryOptions<GetStoryDto[]>,
  itemPerPage?: number,
) {
  const max = itemPerPage === undefined ? MAX_STORIES_PER_PAGE : itemPerPage;
  return useInfiniteQuery<GetStoryDto[]>(
    queryKey,
    ({ pageParam = 0, queryKey }) => queryFn(pageParam * max, max, queryKey),
    {
      ...(options || {}),
      getNextPageParam: (lastPage, allPages) =>
        lastPage === undefined
          ? 0
          : lastPage.length > 0
          ? allPages.length
          : false,
    },
  );
}
