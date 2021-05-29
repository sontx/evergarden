import { AppNav } from "../../components/AppNav";
import { LastUpdatedStories } from "../../features/stories/LastUpdatedStories";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTab } from "../../features/settings/settingsSlice";
import { HotStories } from "../../features/stories/HotStories";
import { AppHeader } from "../../components/AppHeader";
import { Content } from "rsuite";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { FollowingStories } from "../../features/following/FollowingStories";

export function Home() {
  const currentTab = useAppSelector(selectCurrentTab);
  const intl = useIntl();

  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleHome" })} />
      <AppHeader />
      <Content style={{ padding: "10px" }}>
        <AppNav />
        {currentTab === "updated" && <LastUpdatedStories />}
        {currentTab === "hot" && <HotStories />}
        {currentTab === "following" && <FollowingStories />}
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
