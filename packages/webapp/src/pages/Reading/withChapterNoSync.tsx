import React, { ElementType, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useParams } from "react-router-dom";
import {
  selectHistory,
  setCurrentChapterNo,
  setReadingPosition,
  updateStoryHistoryAsync,
} from "../../features/history/historySlice";

export function withChapterNoSync(Component: ElementType) {
  return (props: any) => {
    const dispatch = useAppDispatch();
    const storyHistory = useAppSelector(selectHistory);
    const { chapterNo } = useParams() as any;

    useEffect(() => {
      const currentChapterNo = parseInt(chapterNo);
      if (storyHistory && storyHistory.currentChapterNo != currentChapterNo) {
        dispatch(setCurrentChapterNo(currentChapterNo));
        dispatch(setReadingPosition(0));
        dispatch(
          updateStoryHistoryAsync({
            history: {
              storyId: storyHistory.storyId,
              currentChapterNo: currentChapterNo,
              currentReadingPosition: 0,
            },
            startReading: false,
          }),
        );
      }
    }, [chapterNo, dispatch, storyHistory]);

    return <Component {...props} />;
  };
}
