import { UserStoryListPage } from "../../components/UserStoryListPage";
import React from "react";
import { UserStories } from "../../features/user-stories/UserStories";
import { Icon, IconButton } from "rsuite";
import { useGoCreateStory } from "../../hooks/navigation/useGoCreateStory";

export function UserStoriesPage() {
  const gotoCreateStory = useGoCreateStory();

  return (
    <UserStoryListPage
      title="Your stories"
      action={
        <IconButton
          icon={<Icon icon="plus" />}
          onClick={gotoCreateStory}
          size="sm"
          appearance="link"
        />
      }
    >
      {(props) => <UserStories {...props} />}
    </UserStoryListPage>
  );
}
