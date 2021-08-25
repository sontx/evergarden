import { fetchFollowingStoriesAsync, selectStories } from "./followingSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { UserListItemsChildrenProps } from "../../components/UserListStoriesPage";
import { withDeleteAction } from "./withDeleteAction";
import { UserListStories } from "../../components/UserListStories";
import { selectHistories } from "../histories/historiesSlice";
import { withContinueReading } from "../../components/StoryList/StoryItem/withContinueReading";
import { StoryItem } from "../../components/StoryList/StoryItem";

const FollowingItemWrapper = withContinueReading(withDeleteAction(StoryItem));

export function FollowingStories(props: UserListItemsChildrenProps) {
  const dispatch = useAppDispatch();
  const stories = useAppSelector(selectStories);
  const histories = useAppSelector(selectHistories);

  useEffect(() => {
    const followings = histories.filter(item => item.isFollowing).map(item => item.storyId);
    dispatch(fetchFollowingStoriesAsync(followings));
  }, [dispatch, histories]);

  return (
    <UserListStories
      {...props}
      hasAction
      stories={stories}
      StoryItem={FollowingItemWrapper}
    />
  );
}
