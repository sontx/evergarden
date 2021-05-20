import { ReadingMobile } from "../../features/chapter/ReadingMobile";
import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchStoryByUrlAsync,
  selectStory,
  setStory,
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
import {Helmet} from "react-helmet";
import {selectReadingFont} from "../../features/settings/settingsSlice";

export function Reading() {
  const { url, chapterNo } = useParams() as any;
  const dispatch = useAppDispatch();
  const location = useLocation();
  const intl = useIntl();
  const readingFont = useAppSelector(selectReadingFont);

  const cachedStory = useMemo(() => (location.state || ({} as any)).story, [
    location.state,
  ]);

  useEffect(() => {
    if (cachedStory && cachedStory.url === url) {
      dispatch(setStory(cachedStory));
    }
  }, [cachedStory, dispatch, url]);

  const chapter = useAppSelector(selectChapter);
  const story = useAppSelector(selectStory);

  const showChapter = chapter && chapter.chapterNo == chapterNo && chapter;
  const showStory = story && story.url === url && story;

  useEffect(() => {
    if (!showChapter) {
      dispatch(
        fetchChapterAsync({
          storyId: story ? story.id : url,
          chapterNo,
          searchById: !!story,
        }),
      );
    }

    if (!story) {
      dispatch(fetchStoryByUrlAsync(url));
    }
  }, [chapterNo, dispatch, story, url, showChapter]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [url, chapterNo]);

  return (
    <AppContainer className="reading-theme--dark1">
      <SEO title={intl.formatMessage({ id: "pageTitleReading" })} />
      <AppHeader />
      <Content>
        <ReadingMobile story={showStory} chapter={showChapter} />
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
