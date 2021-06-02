import React from "react";

import { UserListStoriesPage } from "../../components/UserListStoriesPage";
import { useIntl } from "react-intl";
import { RecentStories } from "../../features/recent/RecentStories";

export function History() {
  const intl = useIntl();
  return (
    <UserListStoriesPage title={intl.formatMessage({ id: "userMenuHistory" })}>
      {(props) => <RecentStories {...props} />}
    </UserListStoriesPage>
  );
}
