import { AppNav } from "../../components/AppNav";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTab } from "../../features/settings/settingsSlice";
import { AppHeader } from "../../components/AppHeader";
import { Content } from "rsuite";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { FollowingStories } from "../../features/following/FollowingStories";
import { StoryList } from "../../features/stories/StoryList";

export function Home() {
  const currentTab = useAppSelector(selectCurrentTab);
  const intl = useIntl();

  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleHome" })} />
      <AppHeader />
      <Content
        style={{ padding: "10px", display: "flex", flexDirection: "column" }}
      >
        <AppNav />
        {currentTab === "updated" && <StoryList category="updated" />}
        {currentTab === "hot" && <StoryList category="hot" />}
        {currentTab === "following" && <FollowingStories />}
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
