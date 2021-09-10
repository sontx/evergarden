import { useCacheChapter } from "../features/chapter/hooks/useCacheChapter";
import { useCallback } from "react";
import { GetChapterDto } from "@evergarden/shared";

export function useExtractChapterNoAndCacheChapter() {
  const cacheChapter = useCacheChapter();
  return useCallback(
    (chapterNoOrChapter?: number | GetChapterDto) => {
      if (typeof chapterNoOrChapter === "object") {
        cacheChapter(chapterNoOrChapter);
        return chapterNoOrChapter.chapterNo;
      } else {
        return typeof chapterNoOrChapter === "number" &&
          isFinite(chapterNoOrChapter)
          ? chapterNoOrChapter
          : 1;
      }
    },
    [cacheChapter],
  );
}
