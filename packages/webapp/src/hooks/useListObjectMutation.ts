import { EnhancedMutationOptions } from "./useEnhancedMutation";
import { useListMutation } from "./useListMutation";
import { QueryKey, useQueryClient } from "react-query";

export function useListObjectMutation<
  TRequest = any,
  TResponse = any,
  TTransform = any
>(
  mutationKey: string,
  mutationFn: (data: TRequest) => Promise<TResponse>,
  options: EnhancedMutationOptions<TRequest, TResponse, TTransform> & {
    objectQueryKey: QueryKey;
    objectTransform?: (next: TRequest | TResponse) => any;
    objectUpdateQueryDataFn?: (prev: any, next: any) => any;
    objectUpdateQueryFrom?: "request" | "response";
  },
) {
  const {
    onMutate,
    onError,
    onSuccess,
    objectQueryKey,
    objectUpdateQueryFrom,
    objectTransform = (next) => next,
    objectUpdateQueryDataFn = (prev: any, next: any) => ({
      ...(prev || {}),
      ...(next || {}),
    }),
    ...rest
  } = options;

  const handleMutate = async (variables: TRequest) => {
    let customResult;
    if (onMutate) {
      customResult = onMutate(variables);
    }

    await queryClient.cancelQueries(objectQueryKey);
    const previousData = queryClient.getQueryData(objectQueryKey);
    queryClient.setQueryData(
      objectQueryKey,
      objectUpdateQueryDataFn(previousData, objectTransform(variables)),
    );

    return {
      previousObject: previousData,
      ...(typeof customResult === "object" ? customResult : {}),
    };
  };

  const handleError = (error: any, variables: TRequest, context: any) => {
    if (context?.previousObject) {
      queryClient.setQueryData(objectQueryKey, context.previousObject);
    }
    if (onError) {
      return onError(error, variables, context);
    }
  };

  const handleSuccess = (data: TResponse, variables: TRequest) => {
    queryClient.setQueryData(
      objectQueryKey,
      objectUpdateQueryDataFn(variables, objectTransform(data)),
    );
  };

  const queryClient = useQueryClient();
  return useListMutation(mutationKey, mutationFn, {
    ...rest,
    onMutate: objectUpdateQueryFrom === "request" ? handleMutate : onMutate,
    onError: objectUpdateQueryFrom === "request" ? handleError : onError,
    onSuccess: objectUpdateQueryFrom === "response" ? handleSuccess : onSuccess,
  });
}
