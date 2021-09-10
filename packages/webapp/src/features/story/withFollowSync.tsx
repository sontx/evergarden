import React, { useCallback } from "react";
import { useUnfollowStory } from "../following/hooks/useUnfollowStory";
import { useFollowStory } from "../following/hooks/useFollowStory";
import { withDebouncedClick } from "../../HOCs/withDebouncedClick";
import { GetStoryDto } from "@evergarden/shared";

export function withFollowSync(Component: React.ElementType) {
  const DebouncedComponent = withDebouncedClick(Component);

  return function (props: any) {
    const story = props.story as GetStoryDto;
    const { mutate: unfollowStory } = useUnfollowStory();
    const { mutate: followStory } = useFollowStory();

    const handleFollow = useCallback(() => {
      if (story.history?.isFollowing) {
        unfollowStory(story.id);
      } else {
        followStory(story.id);
      }
    }, [followStory, story.history?.isFollowing, story.id, unfollowStory]);

    return (
      <DebouncedComponent
        {...props}
        onClick={handleFollow}
        isFollowing={!!story.history?.isFollowing}
      />
    );
  };
}
