import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { useExtractSlugAndCacheStory } from "../useExtractSlugAndCacheStory";
import { useExtractChapterNoAndCacheChapter } from "../useExtractChapterNoAndCacheChapter";

export function useGoReading() {
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
      history.push(`/reading/${slug}/${chapterNo > 0 ? chapterNo : 1}`);
    },
    [extractChapterNoAndCacheChapter, extractSlugAndCacheStory, history],
  );
}
