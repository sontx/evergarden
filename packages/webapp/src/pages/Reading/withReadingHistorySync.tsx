import React, { ElementType, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectChapter } from "../../features/chapter/chapterSlice";
import { EndOfSessionWatcher } from "../../utils/end-of-session-watcher";
import { useAutoFlushDebounce } from "../../hooks/useAutoFlushDebounce";
import { useUpdateHistory } from "../../features/histories/hooks/useUpdateHistory";

export function withReadingHistorySync(Component: ElementType) {
  return ({ story, ...rest }: any) => {
    const dispatch = useAppDispatch();
    const chapter = useAppSelector(selectChapter);
    const storyId = useMemo(() => story?.id, [story]);
    const chapterNo = useMemo(() => chapter?.chapterNo, [chapter]);
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
    }, [chapterNo, dispatch, onScroll, storyId, updateHistory]);

    // scroll to previous scroll position
    useEffect(() => {
      if (
        story &&
        story.history &&
        chapter &&
        chapter.chapterNo === story.history.currentChapterNo
      ) {
        window.scrollTo({
          top:
            (story.history.currentReadingPosition || 0) *
            document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      } else {
        window.scrollTo({
          top: 0,
        });
      }
    }, [chapter, dispatch, story]);

    return <Component {...rest} story={story} />;
  };
}
