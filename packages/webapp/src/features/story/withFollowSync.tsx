import React, { useCallback, useEffect, useState } from "react";
import { useUnfollowStory } from "../following/hooks/useUnfollowStory";
import { useFollowStory } from "../following/hooks/useFollowStory";
import { withDebouncedClick } from "../../HOCs/withDebouncedClick";

export function withFollowSync(Component: React.ElementType) {
  const DebouncedComponent = withDebouncedClick(Component);

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
      <DebouncedComponent
        {...props}
        onClick={handleFollow}
        isFollowing={isFollowing}
      />
    );
  };
}
