import { AppNav } from "../../components/AppNav";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentTab } from "../../features/settings/settingsSlice";
import { AppHeader } from "../../components/AppHeader";
import { Content } from "rsuite";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { FollowingStories } from "../../features/following/FollowingStories";
import { StoryList } from "../../features/stories/StoryList";
import { setCategory } from "../../features/stories/storiesSlice";

export function Home() {
  const currentTab = useAppSelector(selectCurrentTab);
  const dispatch = useAppDispatch();
  const intl = useIntl();

  useEffect(() => {
    if (currentTab !== "following") {
      dispatch(setCategory(currentTab));
    }
  }, [currentTab, dispatch]);

  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleHome" })} />
      <AppHeader />
      <Content
        style={{ padding: "10px", display: "flex", flexDirection: "column" }}
      >
        <AppNav />
        {currentTab === "updated" && <StoryList />}
        {currentTab === "hot" && <StoryList />}
        {currentTab === "following" && <FollowingStories />}
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
