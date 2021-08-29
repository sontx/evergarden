import { StoryPreviewMobile } from "../../features/story/StoryPreviewMobile";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchStoryAsync,
  selectErrorMessage,
  selectStatus,
  selectStory,
} from "../../features/story/storySlice";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { useStoryHistory } from "../../features/histories/useStoryHistory";
import { withHttpErrorCatch } from "../../HOCs/withHttpErrorCatch";
import { AppContent } from "../../components/AppContent";

const WrapperStoryPreview = withHttpErrorCatch(StoryPreviewMobile);

export function Story() {
  const { url } = useParams() as any;
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const fetchedStory = useAppSelector(selectStory);
  const story = useStoryHistory(fetchedStory);
  const status = useAppSelector(selectStatus);
  const errorMessage = useAppSelector(selectErrorMessage);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchStoryAsync(url));
  }, [url, dispatch]);

  const showStory = story && story.url === url ? story : undefined;

  return (
    <AppContainer backgroundEffect>
      <SEO title={intl.formatMessage({ id: "pageTitleStory" })} />
      <AppHeader />
      <AppContent noPadding>
        <WrapperStoryPreview
          story={showStory}
          status={status}
          errorMessage={errorMessage}
        />
      </AppContent>
      <AppFooter />
    </AppContainer>
  );
}
