import { useUpdateHistory } from "../../histories/hooks/useUpdateHistory";
import { calculateVoteCount, GetStoryDto, VoteType } from "@evergarden/shared";
import { useQueryClient } from "react-query";

export function useVote(slug?: string) {
  const queryClient = useQueryClient();
  const storyKey = ["story", slug];
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
            queryClient.setQueryData(storyKey, {
              ...previousData,
              history: {
                ...(previousData.history || {}),
                ...variables,
              },
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
