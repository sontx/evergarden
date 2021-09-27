import { useCacheStory } from "../features/story/hooks/useCacheStory";
import { useCallback } from "react";
import { GetStoryDto } from "@evergarden/shared";

export function useExtractSlugAndCacheStory() {
  const cacheStory = useCacheStory();
  return useCallback(
    (slugOrStory: string | GetStoryDto) => {
      let slug;
      if (typeof slugOrStory === "string") {
        slug = slugOrStory;
      } else {
        cacheStory(slugOrStory);
        slug = slugOrStory.slug;
      }
      return slug;
    },
    [cacheStory],
  );
}
