import { MutationOptions, QueryKey, useQueryClient } from "react-query";
import { useSimpleMutation } from "./useSimpleMutation";

export type EnhancedMutationOptions<
  TRequest = any,
  TResponse = any
> = MutationOptions<TResponse, unknown, TRequest> & {
  updateQueryFrom?: "request" | "response";
  relativeQueryKey?: QueryKey;
  updateQueryDataFn?: (prev: any, next: any) => any;
  transformUpdateData?: (next: any) => any;
  alwaysRefetch?: boolean;
};

export function useEnhancedMutation<TRequest = any, TResponse = any>(
  mutationKey: string,
  mutationFn: (data?: TRequest) => Promise<TResponse>,
  options: EnhancedMutationOptions<TRequest, TResponse>,
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
    transformUpdateData,
    ...rest
  } = options || {};

  const queryClient = useQueryClient();
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
          updateQueryDataFn(
            previousData,
            transformUpdateData ? transformUpdateData(request) : request,
          ),
        );
        return { previousData };
      }
    },
    onSuccess: async (data, variables, context) => {
      if (relativeQueryKey) {
        if (!updateQueryFrom) {
          await queryClient.invalidateQueries(relativeQueryKey);
        } else if (updateQueryFrom === "response" && updateQueryDataFn) {
          queryClient.setQueryData(
            relativeQueryKey,
            updateQueryDataFn(
              variables,
              transformUpdateData ? transformUpdateData(data) : data,
            ),
          );
        }
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
