import { MutationOptions, useMutation } from "react-query";
import { useErrorHandler } from "./useErrorHandler";

export function useSimpleMutation<TRequest = any, TResponse = any>(
  mutationKey: string,
  mutationFn: (data: TRequest) => Promise<TResponse>,
  options?: MutationOptions<TResponse, unknown, TRequest>,
) {
  const errorHandler = useErrorHandler();
  const { onError, ...rest } = options || {};
  return useMutation(mutationKey, mutationFn, {
    ...(rest || {}),
    onError: (error, variables, context) => {
      errorHandler(error);
      if (onError) {
        return onError(error, variables, context);
      } else {
        return Promise.resolve();
      }
    },
  });
}
