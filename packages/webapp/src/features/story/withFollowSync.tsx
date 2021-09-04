import React, { useCallback, useEffect, useState } from "react";
import { useUnfollowStory } from "../following/hooks/useUnfollowStory";
import { useFollowStory } from "../following/hooks/useFollowStory";
import { debouncedClick } from "../../utils/debouncedClick";

export function withFollowSync(Component: React.ElementType) {
  return function (props: any) {
    const story = props.story;
    const { mutate: followStory } = useUnfollowStory();
    const { mutate: unfollowStory } = useFollowStory();
    const [isFollowing, setFollowing] = useState<boolean>();

    useEffect(() => {
      setFollowing(!!(story && story.history?.isFollowing));
    }, [story]);

    const handleFollow = useCallback(() => {
      setFollowing((prevState) => {
        const follow = !prevState;
        if (follow) {
          followStory(story.id);
        } else {
          unfollowStory(story.id);
        }
        return follow;
      });
    }, [followStory, story.id, unfollowStory]);

    return (
      <Component
        {...props}
        onClick={debouncedClick(handleFollow)}
        isFollowing={isFollowing}
      />
    );
  };
}
