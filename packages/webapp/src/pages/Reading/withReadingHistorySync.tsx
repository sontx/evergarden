import React, { ElementType, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectChapter } from "../../features/chapter/chapterSlice";
import { updateStoryHistoryAsync } from "../../features/histories/historiesSlice";
import { EndOfSessionWatcher } from "../../utils/end-of-session-watcher";
import { useAutoFlushDebounce } from "../../hooks/useAutoFlushDebounce";

export function withReadingHistorySync(Component: ElementType) {
  return ({ story, ...rest }: any) => {
    const dispatch = useAppDispatch();
    const chapter = useAppSelector(selectChapter);
    const storyId = useMemo(() => story?.id, [story]);
    const chapterNo = useMemo(() => chapter?.chapterNo, [chapter]);

    const onScroll = useAutoFlushDebounce(
      (
        storyId: number,
        chapterNo: number,
        readingPosition: number,
        date: string,
      ) => {
        dispatch(
          updateStoryHistoryAsync({
            storyId,
            currentChapterNo: chapterNo,
            currentReadingPosition: readingPosition,
            date,
          }),
        );
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
        dispatch(
          updateStoryHistoryAsync({
            ...payload,
            date: new Date().toISOString(),
          }),
        );

        // sync history in case the page is closed
        const updateHistory = () => {
          dispatch(
            updateStoryHistoryAsync({
              ...payload,
              currentReadingPosition: computeReadingPosition(),
              date: new Date().toISOString(),
            }),
          );
        };
        EndOfSessionWatcher.instance.register(updateHistory);
        return () => {
          EndOfSessionWatcher.instance.unregister(updateHistory);
          window.removeEventListener("scroll", handleScrollEvent);
        };
      }
    }, [chapterNo, dispatch, onScroll, storyId]);

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
