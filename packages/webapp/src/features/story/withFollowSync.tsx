import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory } from "./storySlice";
import { useDebouncedCallback } from "use-debounce";
import {
  selectHistory,
  setFollowingStory,
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
      500,
    );
    const handleFollow = useCallback(() => {
      setFollowing((prevState) => {
        const follow = !prevState;
        dispatch(setFollowingStory(follow));
        updateFollowDebounce(follow, story, dispatch);
        return follow;
      });
    }, [dispatch, story, updateFollowDebounce]);

    useEffect(() => {
      return () => {
        if (updateFollowDebounce.isPending()) {
          updateFollowDebounce.flush();
        }
      };
    }, [updateFollowDebounce]);

    return (
      <Component {...props} onClick={handleFollow} isFollowing={isFollowing} />
    );
  };
}
