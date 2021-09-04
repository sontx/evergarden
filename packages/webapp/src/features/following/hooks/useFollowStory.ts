import { useQueryClient } from "react-query";
import { useUpdateHistory } from "../../histories/hooks/useUpdateHistory";

export function useFollowStory() {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useUpdateHistory({
    onSuccess: async () => {
      await queryClient.invalidateQueries("following-stories");
    },
  });
  return {
    rest,
    mutate: (id: number) =>
      mutate({
        storyId: id,
        isFollowing: true,
        date: new Date().toISOString(),
      }),
  };
}
