import React, { ElementType, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectChapter } from "../../features/chapter/chapterSlice";
import { selectStory } from "../../features/story/storySlice";
import { useEndOfSessionWatch } from "../../hooks/useEndOfSessionWatch";
import { updateStoryHistoryAsync } from "../../features/histories/historiesSlice";

export function withReadingHistorySync(Component: ElementType) {
  return (props: any) => {
    const dispatch = useAppDispatch();
    const chapter = useAppSelector(selectChapter);
    const story = useAppSelector(selectStory);
    const isEndOfSession = useEndOfSessionWatch();

    useEffect(() => {
      if (story && chapter) {
        const updateHistory = () => {
          dispatch(
            updateStoryHistoryAsync({
              storyId: story.id,
              currentChapterNo: chapter.chapterNo,
              currentReadingPosition:
                window.scrollY / document.documentElement.scrollHeight,
            }),
          );
        }

        if (isEndOfSession) {
          updateHistory();
        }

        return () => updateHistory();
      }
    }, [chapter, dispatch, isEndOfSession, story]);

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

    return <Component {...props} />;
  };
}
