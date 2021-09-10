import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { useAuthorizedRequired } from "../useAuthorizedRequired";
import { GetStoryDto } from "@evergarden/shared";
import { useExtractSlugAndCacheStory } from "../useExtractSlugAndCacheStory";

export function useGoUserChapterList() {
  const history = useHistory();
  const authorizedRequired = useAuthorizedRequired();
  const extractSlugAndCacheStory = useExtractSlugAndCacheStory();
  return useCallback(
    (slugOrStory: string | GetStoryDto) => {
      authorizedRequired(() => {
        const slug = extractSlugAndCacheStory(slugOrStory);
        history.push(`/user/story/${slug}/chapter`);
      });
    },
    [authorizedRequired, extractSlugAndCacheStory, history],
  );
}
