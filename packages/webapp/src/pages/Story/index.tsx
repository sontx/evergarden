import { StoryPreviewMobile } from "../../features/story/StoryPreviewMobile";
import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchStoryByUrlAsync,
  selectStory,
} from "../../features/story/storySlice";
import { AppHeader } from "../../components/AppHeader";
import { Container, Content } from "rsuite";
import { GetStoryDto } from "@evergarden/shared";
import {AppFooter} from "../../components/AppFooter";
import {SEO} from "../../components/SEO";
import {useIntl} from "react-intl";

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

  useEffect(() => {
    dispatch(fetchStoryByUrlAsync(url));
  }, [url, dispatch]);

  useEffect(() => {
    if (story && story.url === url) {
      setShowStory(story);
    }
  }, [story, url]);

  return (
    <Container>
      <SEO title={intl.formatMessage({id: "pageTitleStory"})}/>
      <AppHeader />
      <Content>
        <StoryPreviewMobile story={showStory} />
      </Content>
      <AppFooter/>
    </Container>
  );
}
