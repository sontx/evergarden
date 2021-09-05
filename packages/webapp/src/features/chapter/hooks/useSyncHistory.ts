import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { useEffect, useState } from "react";
import { useUpdateHistory } from "../../histories/hooks/useUpdateHistory";
import { useAutoFlushDebounce } from "../../../hooks/useAutoFlushDebounce";
import { EndOfSessionWatcher } from "../../../utils/end-of-session-watcher";

export function useSyncHistory() {
  type DataType = { story?: GetStoryDto; chapter?: GetChapterDto };
  const [data, setData] = useState<DataType>({});
  const storyId = data.story?.id;
  const chapterNo = data.chapter?.chapterNo;

  const { mutate: updateHistory } = useUpdateHistory();

  const onScroll = useAutoFlushDebounce(
    (
      storyId: number,
      chapterNo: number,
      readingPosition: number,
      date: string,
    ) => {
      updateHistory({
        storyId,
        currentChapterNo: chapterNo,
        currentReadingPosition: readingPosition,
        date,
      });
    },
    5000,
    { trailing: true },
  );

  useEffect(() => {
    if (storyId && chapterNo) {
      const payload = {
        storyId: storyId,
        currentChapterNo: chapterNo,
      };

      const computeReadingPosition = () =>
        window.scrollY / document.documentElement.scrollHeight;

      // sync history in case scrolling
      const handleScrollEvent = () => {
        onScroll(
          storyId,
          chapterNo,
          computeReadingPosition(),
          new Date().toISOString(),
        );
      };
      window.addEventListener("scroll", handleScrollEvent);

      // sync history in case changing chapter
      updateHistory({
        ...payload,
        date: new Date().toISOString(),
      });

      // sync history in case the page is closed
      const forceUpdateHistory = () => {
        updateHistory({
          ...payload,
          currentReadingPosition: computeReadingPosition(),
          date: new Date().toISOString(),
        });
      };
      EndOfSessionWatcher.instance.register(forceUpdateHistory);
      return () => {
        EndOfSessionWatcher.instance.unregister(forceUpdateHistory);
        window.removeEventListener("scroll", handleScrollEvent);
      };
    }
  }, [chapterNo, onScroll, storyId, updateHistory]);

  // scroll to previous scroll position
  useEffect(() => {
    if (
      data.story &&
      data.story.history &&
      data.chapter &&
      data.chapter.chapterNo === data.story.history.currentChapterNo
    ) {
      window.scrollTo({
        top:
          (data.story.history.currentReadingPosition || 0) *
          document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
      });
    }
  }, [data]);

  return setData;
}
