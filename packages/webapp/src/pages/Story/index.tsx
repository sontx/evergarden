import { StoryPreviewMobile } from "../../features/story/StoryPreviewMobile";
import { useLocation, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchStoryByUrlAsync } from "../../features/story/storySlice";
import { AppHeader } from "../../components/AppHeader";
import { Container, Content } from "rsuite";

export function Story() {
  const { url } = useParams() as any;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { story } = (location.state || {}) as any;
  useEffect(() => {
    if (!story || story.url !== url) {
      dispatch(fetchStoryByUrlAsync(url));
    }
  }, [story, url, dispatch]);
  return (
    <Container>
      <AppHeader />
      <Content>
        <StoryPreviewMobile story={story} />
      </Content>
    </Container>
  );
}
