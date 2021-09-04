import { useQueryClient } from "react-query";
import { useUpdateHistory } from "../../histories/hooks/useUpdateHistory";

export function useUnfollowStory() {
  const queryClient = useQueryClient();
  const followingStoriesKey = "following-stories";
  const { mutate, ...rest } = useUpdateHistory({
    onMutate: async ({ storyId }) => {
      await queryClient.cancelQueries(followingStoriesKey);
      const previousData = queryClient.getQueryData(followingStoriesKey);
      if (Array.isArray(previousData)) {
        queryClient.setQueryData(
          followingStoriesKey,
          previousData.filter((item) => item.id !== storyId),
        );
      }
      return { previousData };
    },
    onError: (error, variables, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(followingStoriesKey, context.previousData);
      }
    },
  });
  return {
    rest,
    mutate: (id: number) =>
      mutate({
        storyId: id,
        isFollowing: false,
        date: new Date().toISOString(),
      }),
  };
}
