import { useUpdateHistory } from "../../histories/hooks/useUpdateHistory";
import { calculateVoteCount, GetStoryDto, VoteType } from "@evergarden/shared";
import { useQueryClient } from "react-query";
import { useCacheStory } from "./useCacheStory";

export function useVote(slug?: string) {
  const queryClient = useQueryClient();
  const storyKey = ["story", slug];
  const cacheStory = useCacheStory();
  const { mutate, ...rest } = useUpdateHistory({
    onMutate: async (variables) => {
      if (slug) {
        await queryClient.cancelQueries(storyKey);
        const previousData = queryClient.getQueryData(storyKey) as GetStoryDto;
        if (previousData) {
          const result = calculateVoteCount(
            previousData.history?.vote || "none",
            variables.vote || "none",
          );
          if (result) {
            cacheStory({
              ...previousData,
              history: {
                ...(previousData.history || {}),
                ...variables,
              } as any,
              upvote: previousData.upvote + result.upvote,
              downvote: previousData.downvote + result.downvote,
            });
            return { previousStory: previousData };
          }
        }
      }
    },
    onError: (error, variables, context: any) => {
      if (context?.previousStory) {
        queryClient.setQueryData(storyKey, context.previousStory);
      }
    },
  });
  return {
    ...rest,
    mutate: (story: GetStoryDto, vote: VoteType) => {
      mutate({
        storyId: story.id,
        vote,
        date: new Date().toISOString(),
      });
    },
  };
}
