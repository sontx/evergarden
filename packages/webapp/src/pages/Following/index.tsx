import { FollowingStories } from "../../features/following/FollowingStories";
import React from "react";

import { UserStoryListPage } from "../../components/UserStoryListPage";
import { useIntl } from "react-intl";

export function Following() {
  const intl = useIntl();
  return (
    <UserStoryListPage
      title={intl.formatMessage({ id: "userMenuFollowing" })}
    >
      {(props) => <FollowingStories {...props} />}
    </UserStoryListPage>
  );
}

