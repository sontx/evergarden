import { AppNav } from "../../components/AppNav";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCurrentTab,
  setCurrentTab,
} from "../../features/settings/settingsSlice";
import { AppHeader } from "../../components/AppHeader";
import { Content } from "rsuite";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { FollowingStories } from "../../features/following/FollowingStories";
import { StoryList } from "../../features/stories/StoryList";
import { selectIsLoggedIn } from "../../features/auth/authSlice";

export function Home() {
  const currentTab = useAppSelector(selectCurrentTab);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const intl = useIntl();

  useEffect(() => {
    if (!isLoggedIn && currentTab === "following") {
      dispatch(setCurrentTab("updated"));
    }
  }, [currentTab, dispatch, isLoggedIn]);

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
    </AppContainer>
  );
}
