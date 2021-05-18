import { ReadingMobile } from "../../features/chapter/ReadingMobile";
import { useLocation, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchStoryByUrlAsync, resetStory,
  selectStory,
} from "../../features/story/storySlice";
import {
  fetchChapterAsync, resetChapter,
  selectChapter,
} from "../../features/chapter/chapterSlice";
import { AppHeader } from "../../components/AppHeader";
import { Container, Content } from "rsuite";
import { AppFooter } from "../../components/AppFooter";
import {SEO} from "../../components/SEO";
import {useIntl} from "react-intl";

export function Reading() {
  const { url, chapterNo } = useParams() as any;
  const dispatch = useAppDispatch();
  const location = useLocation();
  const intl = useIntl();

  let cachedStory = (location.state || ({} as any)).story;
  cachedStory =
    cachedStory && cachedStory.url === url ? cachedStory : undefined;

  const chapter = useAppSelector(selectChapter);
  const story = useAppSelector(selectStory);

  useEffect(() => {
    dispatch(resetChapter());
  }, [dispatch]);

  useEffect(() => {
    if (!story || story.url !== url) {
      dispatch(resetStory());
      dispatch(fetchStoryByUrlAsync(url));
    }
  }, [url, dispatch, story]);

  useEffect(() => {
    if (story && story.url === url) {
      dispatch(fetchChapterAsync({ storyId: story.id, chapterNo }));
    }
  }, [story, url, chapterNo, dispatch]);

  return (
    <Container>
      <SEO title={intl.formatMessage({id: "pageTitleReading"})}/>
      <AppHeader />
      <Content>
        <ReadingMobile story={story || cachedStory} chapter={chapter} />
      </Content>
      <AppFooter />
    </Container>
  );
}
