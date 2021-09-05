import {
  EnhancedMutationOptions,
  useEnhancedMutation,
} from "./useEnhancedMutation";
import { updateListObjects } from "../../utils/list-utils";

export function useListMutation<TRequest = any, TResponse = any, TTransform = any>(
  mutationKey: string,
  mutationFn: (data: TRequest) => Promise<TResponse>,
  options: EnhancedMutationOptions<TRequest, TResponse, TTransform> & {
    removingData?: boolean;
  },
) {
  const { updateQueryDataFn, removingData, ...rest } = options;
  return useEnhancedMutation(mutationKey, mutationFn, {
    ...rest,
    updateQueryDataFn:
      updateQueryDataFn ||
      ((prev: any, next: any) => {
        if (!prev) {
          return removingData ? undefined : [next];
        }

        if (removingData) {
          return prev.filter((item: any) => item.id !== next.id);
        }

        return updateListObjects(
          prev,
          next,
          (item1, item2) => item1.id === item2.id,
        );
      }),
  });
}
