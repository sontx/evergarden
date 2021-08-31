import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";
import { GetStoryDto } from "@evergarden/shared";

const MAX_STORIES_PER_PAGE = 10;

export function useInfinitePageQuery(
  name: string,
  page: number,
  queryFn: (skip: number, limit: number) => Promise<GetStoryDto[]>,
  options?: UseInfiniteQueryOptions<GetStoryDto[]>,
  itemPerPage?: number,
) {
  const max = itemPerPage === undefined ? MAX_STORIES_PER_PAGE : itemPerPage;
  return useInfiniteQuery<GetStoryDto[]>(
    [name, page],
    ({ pageParam = 0 }) => queryFn(pageParam * max, max),
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
