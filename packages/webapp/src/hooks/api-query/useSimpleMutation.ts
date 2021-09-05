import { MutationOptions, useMutation } from "react-query";
import { useErrorHandler } from "./useErrorHandler";

export type SimpleMutationOptions<
  TRequest = any,
  TResponse = any
> = MutationOptions<TResponse, unknown, TRequest> & {
  silent?: boolean;
};

export function useSimpleMutation<TRequest = any, TResponse = any>(
  mutationKey: string,
  mutationFn: (data: TRequest) => Promise<TResponse>,
  options?: SimpleMutationOptions,
) {
  const errorHandler = useErrorHandler();
  const { onError, silent, ...rest } = options || {};
  return useMutation(mutationKey, mutationFn, {
    ...(rest || {}),
    onError: (error, variables, context) => {
      if (!silent) {
        errorHandler(error);
      }
      if (onError) {
        return onError(error, variables, context);
      } else {
        return Promise.resolve();
      }
    },
  });
}
