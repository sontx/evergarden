import { UserListStoriesPage } from "../../components/UserListStoriesPage";
import React from "react";
import { UserStories } from "../../features/user-stories/UserStories";
import { Icon, IconButton } from "rsuite";
import { useGoCreateStory } from "../../hooks/navigation/useGoCreateStory";

export function UserStoriesPage() {
  const gotoCreateStory = useGoCreateStory();

  return (
    <UserListStoriesPage
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
    </UserListStoriesPage>
  );
}
