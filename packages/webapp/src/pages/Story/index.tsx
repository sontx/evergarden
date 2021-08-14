import { StoryPreviewMobile } from "../../features/story/StoryPreviewMobile";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchStoryAsync, selectStory } from "../../features/story/storySlice";
import { AppHeader } from "../../components/AppHeader";
import { Content } from "rsuite";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { useStoryHistory } from "../../features/histories/useStoryHistory";

export function Story() {
  const { url } = useParams() as any;
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const story = useStoryHistory(useAppSelector(selectStory));

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchStoryAsync(url));
  }, [url, dispatch]);

  const showStory = story && story.url === url ? story : undefined;

  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleStory" })} />
      <AppHeader />
      <Content>
        <StoryPreviewMobile story={showStory} />
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
