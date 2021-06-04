import { UserListStoriesPage } from "../../components/UserListStoriesPage";
import React from "react";
import { UserStories } from "../../features/user-stories/UserStories";

export function UserStoriesPage() {
  return (
    <UserListStoriesPage title="Your stories">
      {(props) => <UserStories {...props} />}
    </UserListStoriesPage>
  );
}
