import { QueryKey, useQueryClient } from "react-query";
import { SimpleMutationOptions, useSimpleMutation } from "./useSimpleMutation";
import { useReactQueryPersist } from "../useReactQueryPersist";

export type EnhancedMutationOptions<
  TRequest = any,
  TResponse = any,
  TTransform = any
> = SimpleMutationOptions<TRequest, TResponse> & {
  updateQueryFrom?: "request" | "response";
  relativeQueryKey?: QueryKey;
  updateQueryDataFn?: (prev: any, next: TTransform) => any;
  transformUpdateData?: (next: TRequest | TResponse) => TTransform;
  alwaysRefetch?: boolean;
  persistKey?: string;
  persistCacheTime?: number | string | false;
};

export function useEnhancedMutation<TRequest = any, TResponse = any>(
  mutationKey: string,
  mutationFn: (data: TRequest) => Promise<TResponse>,
  options?: EnhancedMutationOptions<TRequest, TResponse>,
) {
  const {
    onMutate,
    onError,
    onSuccess,
    onSettled,
    updateQueryFrom,
    relativeQueryKey,
    updateQueryDataFn,
    alwaysRefetch,
    persistKey,
    persistCacheTime,
    transformUpdateData = (next: TRequest | TResponse) => next,
    ...rest
  } = options || {};

  const queryClient = useQueryClient();
  const persist = useReactQueryPersist();
  return useSimpleMutation(mutationKey, mutationFn, {
    onMutate: async (request) => {
      let customResult;
      if (onMutate) {
        customResult = onMutate(request);
        if (
          customResult &&
          typeof customResult === "object" &&
          customResult.constructor.name === "Promise"
        ) {
          customResult = await customResult;
        }
      }

      if (!updateQueryFrom || !relativeQueryKey) {
        return customResult;
      }

      if (updateQueryFrom === "request" && updateQueryDataFn) {
        await queryClient.cancelQueries(relativeQueryKey);
        const previousData = queryClient.getQueryData(relativeQueryKey);
        queryClient.setQueryData(
          relativeQueryKey,
          updateQueryDataFn(previousData, transformUpdateData(request)),
        );
        return {
          previousData,
          ...(typeof customResult === "object" ? customResult : {}),
        };
      }
    },
    onSuccess: async (data, variables, context) => {
      if (relativeQueryKey) {
        if (!updateQueryFrom) {
          await queryClient.invalidateQueries(relativeQueryKey);
        } else if (updateQueryFrom === "response" && updateQueryDataFn) {
          const previousData = queryClient.getQueryData(relativeQueryKey);
          queryClient.setQueryData(
            relativeQueryKey,
            updateQueryDataFn(previousData, transformUpdateData(data)),
          );
        }
      }

      if (persistKey) {
        persist(persistKey, data, persistCacheTime);
      }

      if (onSuccess) {
        return onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context: any) => {
      if (context?.previousData && relativeQueryKey) {
        queryClient.setQueryData(relativeQueryKey, context.previousData);
      }

      if (onError) {
        return onError(error, variables, context);
      }
    },
    onSettled: async (data, error, variables, context) => {
      if (alwaysRefetch && relativeQueryKey && !!updateQueryFrom) {
        await queryClient.invalidateQueries(relativeQueryKey);
      }

      if (onSettled) {
        return onSettled(data, error, variables, context);
      }
    },
    ...rest,
  });
}
