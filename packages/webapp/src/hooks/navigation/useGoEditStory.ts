import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { useExtractSlugAndCacheStory } from "../useExtractSlugAndCacheStory";
import { GetStoryDto } from "@evergarden/shared";

export function useGoEditStory() {
  const history = useHistory();
  const extractSlugAndCacheStory = useExtractSlugAndCacheStory();
  return useCallback(
    (slugOrStory: string | GetStoryDto) => {
      const slug = extractSlugAndCacheStory(slugOrStory);
      history.push(`/user/story/${slug}`);
    },
    [extractSlugAndCacheStory, history],
  );
}
