import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { useExtractSlugAndCacheStory } from "../useExtractSlugAndCacheStory";

export function useGoUserChapterList() {
  const history = useHistory();
  const extractSlugAndCacheStory = useExtractSlugAndCacheStory();
  return useCallback(
    (slugOrStory: string | GetStoryDto) => {
      const slug = extractSlugAndCacheStory(slugOrStory);
      history.push(`/user/story/${slug}/chapter`);
    },
    [extractSlugAndCacheStory, history],
  );
}
