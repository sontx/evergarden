import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory } from "./storySlice";
import { useAutoFlushDebounce } from "../../hooks/useAutoFlushDebounce";
import { updateStoryHistoryAsync } from "../histories/historiesSlice";

export function withFollowSync(Component: React.ElementType) {
  return function (props: any) {
    const story = useAppSelector(selectStory);
    const dispatch = useAppDispatch();

    const [isFollowing, setFollowing] = useState<boolean>();

    useEffect(() => {
      setFollowing(!!(story && story.history?.isFollowing));
    }, [story]);

    const updateFollowDebounce = useAutoFlushDebounce(
      (isFollowing, story, dispatch) => {
        dispatch(
          updateStoryHistoryAsync({
            storyId: story.id,
            isFollowing: !!isFollowing,
          }),
        );
      },
      500,
    );

    const handleFollow = useCallback(() => {
      setFollowing((prevState) => {
        const follow = !prevState;
        updateFollowDebounce(follow, story, dispatch);
        return follow;
      });
    }, [dispatch, story, updateFollowDebounce]);

    return (
      <Component {...props} onClick={handleFollow} isFollowing={isFollowing} />
    );
  };
}
