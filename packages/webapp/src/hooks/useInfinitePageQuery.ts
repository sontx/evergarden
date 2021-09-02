import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";
import { GetStoryDto } from "@evergarden/shared";
import { handleRequestError } from "../utils/api";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();
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
      onError: (err) => {
        const errorDetails = handleRequestError(err as any);
        if (errorDetails.code) {
          history.replace(history.location.pathname, {
            errorStatusCode: errorDetails.code,
            errorMessage: errorDetails.message,
          });
        }
      },
    },
  );
}
