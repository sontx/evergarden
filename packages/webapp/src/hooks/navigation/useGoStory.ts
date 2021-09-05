import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { useExtractSlugAndCacheStory } from "../useExtractSlugAndCacheStory";

export function useGoStory() {
  const history = useHistory();
  const extractSlugAndCacheStory = useExtractSlugAndCacheStory();
  return useCallback(
    (slugOrStory: string | GetStoryDto, locationState?: any) => {
      const slug = extractSlugAndCacheStory(slugOrStory);
      history.push(`/story/${slug}`, locationState);
    },
    [extractSlugAndCacheStory, history],
  );
}
