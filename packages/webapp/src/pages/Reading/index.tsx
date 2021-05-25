import { ReadingMobile } from "../../features/chapter/ReadingMobile";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchStoryByUrlAsync,
  selectStory,
} from "../../features/story/storySlice";
import {
  fetchChapterAsync,
  selectChapter,
} from "../../features/chapter/chapterSlice";
import { AppHeader } from "../../components/AppHeader";
import { Content } from "rsuite";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { Helmet } from "react-helmet";
import { selectReadingFont } from "../../features/settings/settingsSlice";
import { withScrollSync } from "./withScrollSync";
import { withChapterNoSync } from "./withChapterNoSync";
import { withViewCountSync } from "./withViewCountSync";

const ReadingWrapper = withViewCountSync(
  withScrollSync(withChapterNoSync(ReadingMobile)),
);

export function Reading() {
  const { url, chapterNo } = useParams() as any;
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const readingFont = useAppSelector(selectReadingFont);

  const chapter = useAppSelector(selectChapter);
  const story = useAppSelector(selectStory);

  useEffect(() => {
    if (!story || story.url !== url) {
      dispatch(fetchStoryByUrlAsync(url));
    }
  }, [dispatch, story, url]);

  const showStory = story && story.url === url ? story : undefined;
  const showChapter =
    chapter && showStory && chapter.storyId === showStory.id
      ? chapter
      : undefined;

  useEffect(() => {
    if (showStory) {
      dispatch(fetchChapterAsync({ storyId: showStory.id, chapterNo }));
    }
  }, [chapterNo, dispatch, showStory]);

  return (
    <AppContainer className="reading-theme--dark1">
      <SEO title={intl.formatMessage({ id: "pageTitleReading" })} />
      <AppHeader />
      <Content>
        <ReadingWrapper story={showStory} chapter={showChapter} />
      </Content>
      <AppFooter />
      <Helmet>
        <link
          href={`https://fonts.googleapis.com/css?family=${readingFont}`}
          rel="stylesheet"
        />
      </Helmet>
    </AppContainer>
  );
}
