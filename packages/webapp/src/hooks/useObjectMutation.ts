import {
  EnhancedMutationOptions,
  useEnhancedMutation,
} from "./useEnhancedMutation";

export function useObjectMutation<TRequest = any, TResponse = any>(
  mutationKey: string,
  mutationFn: (data?: TRequest) => Promise<TResponse>,
  options: EnhancedMutationOptions<TRequest, TResponse> & {
    removingData?: boolean;
  },
) {
  const { updateQueryDataFn, removingData, ...rest } = options;
  return useEnhancedMutation(mutationKey, mutationFn, {
    ...rest,
    updateQueryDataFn:
      updateQueryDataFn ||
      ((prev: any, next: any) =>
        removingData ? undefined : { ...prev, ...next }),
  });
}
