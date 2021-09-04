import { useUpdateHistory } from "../../histories/hooks/useUpdateHistory";
import { VoteType } from "@evergarden/shared";

export function useVote() {
  const { mutate, ...rest } = useUpdateHistory();
  return {
    ...rest,
    mutate: (storyId: number, vote: VoteType) =>
      mutate({
        storyId,
        vote,
      }),
  };
}
