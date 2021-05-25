import React, { ElementType, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectChapter } from "../../features/chapter/chapterSlice";
import { selectStory } from "../../features/story/storySlice";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import {
  selectHistory,
  setReadingPosition,
  updateStoryHistoryAsync,
} from "../../features/history/historySlice";

let isBackToPreviousPosition: boolean;
let lastScrollPosition: number;

export function withScrollSync(Component: ElementType) {
  return (props: any) => {
    const dispatch = useAppDispatch();
    const chapter = useAppSelector(selectChapter);
    const story = useAppSelector(selectStory);
    const storyHistory = useAppSelector(selectHistory);
    const { url, chapterNo } = useParams() as any;

    // scroll to top
    useEffect(() => {
      isBackToPreviousPosition = false;
      lastScrollPosition = 0;
      window.scrollTo({ top: 0 });
    }, [url, chapterNo]);

    // scroll to previous scroll position
    useEffect(() => {
      if (
        !isBackToPreviousPosition &&
        storyHistory &&
        chapter &&
        chapter.chapterNo === storyHistory.currentChapterNo
      ) {
        isBackToPreviousPosition = true;
        const position = storyHistory.currentReadingPosition || 0;
        window.scrollTo({
          top: position * document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    }, [chapter, dispatch, storyHistory]);

    // do update current scroll position to the server with debounce to reduce calling times
    const updateScrollStateDebounce = useDebouncedCallback(
      (dispatch, story, chapter, position) => {
        const history = {
          storyId: story.id,
          currentChapterNo: chapter.chapterNo,
          currentReadingPosition: position,
        };
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

    const computeCurrentPosition = () =>
      window.scrollY / document.documentElement.scrollHeight;

    // hook window scroll event
    useEffect(() => {
      const handleScroll = () => {
        if (story && chapter && story.id === chapter.storyId) {
          updateScrollStateDebounce(
            dispatch,
            story,
            chapter,
            (lastScrollPosition = computeCurrentPosition()),
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

    useEffect(() => {
      return () => {
        if (story) {
          dispatch(setReadingPosition(lastScrollPosition));
        }
      };
    }, [dispatch, story]);

    return <Component {...props} />;
  };
}
