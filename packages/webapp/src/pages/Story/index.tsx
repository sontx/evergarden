import { StoryPreviewMobile } from "../../features/story/StoryPreviewMobile";
import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchStoryByUrlAsync,
  selectStory,
} from "../../features/story/storySlice";
import { AppHeader } from "../../components/AppHeader";
import { Content } from "rsuite";
import { GetStoryDto } from "@evergarden/shared";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import {
  fetchStoryHistoryAsync,
  selectStoryHistory
} from "../../features/history/historySlice";
import {selectUser} from "../../features/auth/authSlice";

export function Story() {
  const { url } = useParams() as any;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const story = useAppSelector(selectStory);
  const locationStory = ((location.state as any) || {}).story;
  const [showStory, setShowStory] = useState<GetStoryDto | undefined>(
    (locationStory || {}).url === url ? locationStory : undefined,
  );

  const storyHistory = useAppSelector(selectStoryHistory)
  const user = useAppSelector(selectUser)

  useEffect(() => {
    dispatch(fetchStoryByUrlAsync(url));
  }, [url, dispatch]);

  useEffect(() => {
    if (story && story.url === url) {
      setShowStory(story);
    }
  }, [story, url]);

  useEffect(() => {
    if (story && user && user.historyId) {
      dispatch(fetchStoryHistoryAsync({storyId: story.id, historyId: user.historyId}))
    }
  }, [story, user, dispatch])

  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleStory" })} />
      <AppHeader />
      <Content>
        <StoryPreviewMobile story={showStory} storyHistory={storyHistory}/>
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
