import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { useExtractSlugAndCacheStory } from "../useExtractSlugAndCacheStory";
import { useExtractChapterNoAndCacheChapter } from "../useExtractChapterNoAndCacheChapter";
import { GetChapterDto, GetStoryDto } from "@evergarden/shared";

export function useGoEditChapter() {
  const history = useHistory();
  const extractSlugAndCacheStory = useExtractSlugAndCacheStory();
  const extractChapterNoAndCacheChapter = useExtractChapterNoAndCacheChapter();
  return useCallback(
    (
      slugOrStory: string | GetStoryDto,
      chapterNoOrChapter?: number | GetChapterDto,
    ) => {
      const slug = extractSlugAndCacheStory(slugOrStory);
      const chapterNo = extractChapterNoAndCacheChapter(chapterNoOrChapter);
      history.push(`/user/story/${slug}/chapter/${chapterNo}`);
    },
    [extractChapterNoAndCacheChapter, extractSlugAndCacheStory, history],
  );
}
