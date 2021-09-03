import { FollowingStories } from "../../features/following/FollowingStories";
import React from "react";

import { UserListStoriesPage } from "../../components/UserListStoriesPage";
import { useIntl } from "react-intl";

export function Following() {
  const intl = useIntl();
  return (
    <UserListStoriesPage
      title={intl.formatMessage({ id: "userMenuFollowing" })}
    >
      {(props) => <FollowingStories {...props} />}
    </UserListStoriesPage>
  );
}

