import { fetchRecentStoriesAsync, selectStories } from "./recentSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { UserListItemsChildrenProps } from "../../components/UserListStoriesPage";
import { StoryItemEx } from "../../components/StoryItemEx";
import { withAnimation } from "../../components/StoryItemEx/withAnimation";
import { UserListStories } from "../../components/UserListStories";
import { withContinueReading } from "../../components/StoryItemEx/withContinueReading";

const StoryItemWrapper = withContinueReading(withAnimation(StoryItemEx));

export function RecentStories(props: UserListItemsChildrenProps) {
  const dispatch = useAppDispatch();
  const stories = useAppSelector(selectStories);

  useEffect(() => {
    dispatch(fetchRecentStoriesAsync());
  }, [dispatch]);

  return (
    <UserListStories
      {...props}
      stories={stories}
      StoryItem={StoryItemWrapper}
    />
  );
}
