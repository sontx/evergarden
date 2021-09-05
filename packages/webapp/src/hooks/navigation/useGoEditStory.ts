import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { useExtractSlugAndCacheStory } from "../useExtractSlugAndCacheStory";
import { GetStoryDto } from "@evergarden/shared";
import { useAuthorizedRequired } from "../useAuthorizedRequired";

export function useGoEditStory() {
  const history = useHistory();
  const extractSlugAndCacheStory = useExtractSlugAndCacheStory();
  const authorizedRequired = useAuthorizedRequired();
  return useCallback(
    (slugOrStory: string | GetStoryDto) => {
      authorizedRequired(() => {
        const slug = extractSlugAndCacheStory(slugOrStory);
        history.push(`/user/story/${slug}`);
      });
    },
    [authorizedRequired, extractSlugAndCacheStory, history],
  );
}
