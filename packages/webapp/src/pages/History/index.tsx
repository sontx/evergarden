import React from "react";

import { UserStoryListPage } from "../../components/UserStoryListPage";
import { useIntl } from "react-intl";
import { RecentStories } from "../../features/histories/RecentStories";

export function History() {
  const intl = useIntl();

  return (
    <UserStoryListPage title={intl.formatMessage({ id: "userMenuHistory" })}>
      {(props) => <RecentStories {...props}/>}
    </UserStoryListPage>
  );
}
