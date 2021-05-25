import { ReactElement, useEffect, useState } from "react";
import { updateStoryHistoryAsync } from "../../features/history/historySlice";
import { useDebouncedCallback } from "use-debounce";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectChapter } from "../../features/chapter/chapterSlice";
import { selectStory } from "../../features/story/storySlice";
import { useParams } from "react-router-dom";

export function ReadingSync({ children }: { children: ReactElement }) {
  const dispatch = useAppDispatch();
  const chapter = useAppSelector(selectChapter);
  const story = useAppSelector(selectStory);

  const [storyHistory, setStoryHistory] = useState<any>(story && story.history);

  // scroll to top
  const { url, chapterNo } = useParams() as any;
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [url, chapterNo]);

  // scroll to previous scroll position
  useEffect(() => {
    if (
      chapter &&
      storyHistory &&
      chapter.chapterNo === storyHistory.currentChapterNo &&
      !storyHistory.dontNeedScroll
    ) {
      window.scrollTo({
        top:
          (storyHistory.currentReadingPosition || 0) *
          document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chapter, storyHistory]);

  // do update current scroll position to the server with debounce to reduce calling times
  const updateScrollStateDebounce = useDebouncedCallback(
    (dispatch, story, chapter, position) => {
      const history = {
        storyId: story.id,
        currentChapterNo: chapter.chapterNo,
        currentReadingPosition: position,
      };
      setStoryHistory({ ...history, dontNeedScroll: true });
      dispatch(
        updateStoryHistoryAsync({
          history,
          startReading: false,
        }),
      );
    },
    5000,
    { trailing: true },
  );

  // hook window scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (story && chapter && story.id === chapter.storyId) {
        updateScrollStateDebounce(
          dispatch,
          story,
          chapter,
          window.scrollY / document.documentElement.scrollHeight,
        );
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapter, dispatch, story, updateScrollStateDebounce]);

  // make sure that pending updating is called when the user navigate to another view
  useEffect(() => {
    return () => {
      if (updateScrollStateDebounce.isPending()) {
        updateScrollStateDebounce.flush();
      }
    };
  }, [updateScrollStateDebounce]);

  // update user's current chapter No
  useEffect(() => {
    if (story && chapter) {
      const timeoutId = window.setTimeout(() => {
        dispatch(
          updateStoryHistoryAsync({
            history: {
              storyId: story.id,
              currentChapterNo: chapter.chapterNo,
            },
            startReading: false,
          }),
        );
      }, 1000);
      return () => window.clearTimeout(timeoutId);
    }
  }, [chapter, dispatch, story]);

  // update story's view count, after 5s if the user is still reading in this page we'll count it as a view
  useEffect(() => {
    if (story) {
      setStoryHistory(story.history);

      const timeoutId = window.setTimeout(() => {
        dispatch(
          updateStoryHistoryAsync({
            history: {
              storyId: story.id,
            },
            startReading: true,
          }),
        );
      }, 5000);
      return () => window.clearTimeout(timeoutId);
    }
  }, [dispatch, story]);

  return children;
}
