import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { UserListItemsChildrenProps } from "../../components/UserListStoriesPage";
import { StoryItemEx } from "../../components/StoryItemEx";
import { UserListStories } from "../../components/UserListStories";
import { fetchUserStoriesAsync, selectStories } from "./userStoriesSlice";
import { withDeleteAction } from "./withDeleteAction";
import { withCustomizedItem } from "./withCustomizedItem";
import { withEditUserStory } from "./withEditUserStory";

const StoryItemWrapper = withEditUserStory(
  withCustomizedItem(withDeleteAction(StoryItemEx)),
);

export function UserStories(props: UserListItemsChildrenProps) {
  const dispatch = useAppDispatch();
  const stories = useAppSelector(selectStories);

  useEffect(() => {
    dispatch(fetchUserStoriesAsync());
  }, [dispatch]);

  return (
    <UserListStories
      {...props}
      hasAction
      stories={stories}
      StoryItem={StoryItemWrapper}
    />
  );
}
