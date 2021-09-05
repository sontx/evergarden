import {
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "react-query";
import { GetStoryDto } from "@evergarden/shared";
import { useErrorHandler } from "./useErrorHandler";

const MAX_STORIES_PER_PAGE = 20;

export function useInfinitePageQuery(
  queryKey: QueryKey,
  queryFn: (
    skip: number,
    limit: number,
    queryKey?: readonly any[],
  ) => Promise<GetStoryDto[]>,
  options?: UseInfiniteQueryOptions<GetStoryDto[]>,
  itemPerPage?: number,
) {
  const max = itemPerPage === undefined ? MAX_STORIES_PER_PAGE : itemPerPage;
  const errorHandler = useErrorHandler();
  const { onError, ...rest } = options || {};
  return useInfiniteQuery<GetStoryDto[]>(
    queryKey,
    ({ pageParam = 0, queryKey }) => queryFn(pageParam * max, max, queryKey),
    {
      ...rest,
      getNextPageParam: (lastPage, allPages) =>
        lastPage === undefined
          ? 0
          : lastPage.length > 0
          ? allPages.length
          : false,
      onError: (err) => {
        errorHandler(err);
        if (onError) {
          onError(err);
        }
      },
    },
  );
}
