import { useQueryClient } from "react-query";
import { useCallback } from "react";
import { GetStoryDto } from "@evergarden/shared";

export function useCacheStory() {
  const queryClient = useQueryClient();
  return useCallback(
    (story: GetStoryDto) => {
      queryClient.setQueryData(["story", story.slug], story);
    },
    [queryClient],
  );
}
