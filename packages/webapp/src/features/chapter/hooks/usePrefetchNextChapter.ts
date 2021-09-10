import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { useQueryClient } from "react-query";
import { fetchChapter } from "../chapterAPI";
import ms from "ms";

export function usePrefetchNextChapter(
  story: GetStoryDto | undefined,
  chapter: GetChapterDto | undefined,
) {
  const queryClient = useQueryClient();
  if (story && chapter && typeof story.lastChapter === "number") {
    const nextChapterNo =
      story.lastChapter > chapter.chapterNo ? chapter.chapterNo + 1 : false;
    if (nextChapterNo) {
      queryClient
        .prefetchQuery(
          [
            "chapter",
            {
              storyId: story.id,
              chapterNo: nextChapterNo,
            },
          ],
          () => fetchChapter(story.id, nextChapterNo),
          {
            staleTime: ms("30m"),
            cacheTime: ms("35m"),
          },
        )
        .then();
    }
  }
}
