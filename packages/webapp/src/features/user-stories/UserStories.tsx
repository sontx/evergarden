import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { UserListItemsChildrenProps } from "../../components/UserListStoriesPage";
import { UserListStories } from "../../components/UserListStories";
import {
  fetchUserStoriesAsync,
  selectStatus,
  selectStories,
} from "./userStoriesSlice";
import { withDeleteAction } from "./withDeleteAction";
import { withCustomizedItem } from "./withCustomizedItem";
import { withEditUserStory } from "./withEditUserStory";
import { StoryItem } from "../../components/StoryList/StoryItem";

const StoryItemWrapper = withEditUserStory(
  withCustomizedItem(withDeleteAction(StoryItem)),
);

export function UserStories(props: UserListItemsChildrenProps) {
  const dispatch = useAppDispatch();
  const stories = useAppSelector(selectStories);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchUserStoriesAsync());
  }, [dispatch]);

  return (
    <UserListStories
      {...props}
      hasAction
      status={status}
      stories={stories}
      StoryItem={StoryItemWrapper}
    />
  );
}
