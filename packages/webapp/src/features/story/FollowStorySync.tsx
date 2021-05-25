import React, {ReactElement, useCallback, useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory } from "./storySlice";
import { useDebouncedCallback } from "use-debounce";
import { updateStoryHistoryAsync } from "../history/historySlice";

export function withFollowSync(Component: React.ElementType) {
  return function (props: any) {
    const story = useAppSelector(selectStory);
    const dispatch = useAppDispatch();

    const [isFollowing, setFollowing] = useState<boolean>(
      !!(story && story.history && story.history.isFollowing),
    );

    useEffect(() => {
      setFollowing(!!(story && story.history && story.history.isFollowing));
    }, [story]);

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
