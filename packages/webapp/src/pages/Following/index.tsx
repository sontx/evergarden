import { FollowingStories } from "../../features/following/FollowingStories";
import React from "react";

import "./index.less";
import { UserListItemsPage } from "../../components/UserListItemsPage";
import { useIntl } from "react-intl";

export function Following() {
  const intl = useIntl();
  return (
    <UserListItemsPage title={intl.formatMessage({ id: "userMenuFollowing" })}>
      {(props) => <FollowingStories {...props} />}
    </UserListItemsPage>
  );
}
