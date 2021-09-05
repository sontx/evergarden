import { QueryKey, useQuery, UseQueryOptions } from "react-query";
import { useErrorHandler } from "./useErrorHandler";

export function useSimpleQuery<T>(
  queryKey: QueryKey,
  queryFn: (queryKey: QueryKey) => Promise<T>,
  options?: UseQueryOptions<T>,
) {
  const errorHandler = useErrorHandler();
  const { onError, ...rest } = options || {};
  return useQuery<T>(queryKey, (context) => queryFn(context.queryKey), {
    ...(rest || {}),
    onError: (err) => {
      errorHandler(err);
      if (onError) {
        onError(err);
      }
    },
  });
}
