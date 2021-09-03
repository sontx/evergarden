import { EnhancedMutationOptions } from "../../../hooks/useEnhancedMutation";
import { updateStoryHistory } from "../../histories/historiesAPI";
import { useListMutation } from "../../../hooks/useListMutation";
import { useQueryClient } from "react-query";

export function useUnfollowStory(options?: EnhancedMutationOptions) {
  const queryClient = useQueryClient();
  const readingHistoryKey = "reading-history";
  return useListMutation(
    "unfollow-story",
    (data) => updateStoryHistory({ storyId: data.id, isFollowing: false }),
    {
      relativeQueryKey: "following-stories",
      updateQueryFrom: "request",
      removingData: true,
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries(readingHistoryKey);
        const previousData = queryClient.getQueryData(
          readingHistoryKey,
        ) as any[];
        queryClient.setQueryData(
          readingHistoryKey,
          (previousData || []).map((item) =>
            item.storyId !== id ? item : { ...item, isFollowing: false },
          ),
        );
        return { previousData };
      },
      onError: (error, variables, context: any) => {
        if (context?.previousData) {
          queryClient.setQueryData(readingHistoryKey, context.previousData);
        }
      },
    },
  );
}
