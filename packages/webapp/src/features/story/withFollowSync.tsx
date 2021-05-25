import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory } from "./storySlice";
import { useDebouncedCallback } from "use-debounce";
import {
  selectHistory,
  updateStoryHistoryAsync,
} from "../history/historySlice";

export function withFollowSync(Component: React.ElementType) {
  return function (props: any) {
    const story = useAppSelector(selectStory);
    const storyHistory = useAppSelector(selectHistory);
    const dispatch = useAppDispatch();

    const [isFollowing, setFollowing] = useState<boolean>(
      !!(storyHistory && storyHistory.isFollowing),
    );

    useEffect(() => {
      setFollowing(!!(storyHistory && storyHistory.isFollowing));
    }, [story, storyHistory]);

    const updateFollowDebounce = useDebouncedCallback(
      (isFollowing, story, dispatch) => {
        dispatch(
          updateStoryHistoryAsync({
            history: {
              storyId: story.id,
              isFollowing: !!isFollowing,
            },
            startReading: false,
          }),
        );
      },
      1000,
    );
    const handleFollow = useCallback(() => {
      setFollowing((prevState) => {
        updateFollowDebounce(!prevState, story, dispatch);
        return !prevState;
      });
    }, [dispatch, story, updateFollowDebounce]);

    return (
      <Component {...props} onClick={handleFollow} isFollowing={isFollowing} />
    );
  };
}
