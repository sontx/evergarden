import { useQueryClient } from "react-query";
import { useCallback } from "react";
import { GetChapterDto } from "@evergarden/shared";

export function useCacheChapter() {
  const queryClient = useQueryClient();
  return useCallback(
    (chapter: GetChapterDto) => {
      queryClient.setQueryData(
        ["chapter", { storyId: chapter.storyId, chapterNo: chapter.chapterNo }],
        chapter,
      );
    },
    [queryClient],
  );
}
