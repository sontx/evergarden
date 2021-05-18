import { ReadingMobile } from "../../features/chapter/ReadingMobile";
import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
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

export function Reading() {
  const { url, chapterNo } = useParams() as any;
  const dispatch = useAppDispatch();
  const location = useLocation();
  const intl = useIntl();

  const cachedStory = (location.state || ({} as any)).story || ({} as any);
  const chapter = useAppSelector(selectChapter);
  const story = useAppSelector(selectStory);
  const [showStory, setShowStory] = useState(
    (story || {}).url === url
      ? story
      : cachedStory.url === url
      ? cachedStory
      : undefined,
  );

  useEffect(() => {
    if (showStory) {
      dispatch(
        fetchChapterAsync({
          storyId: showStory.id,
          chapterNo,
          searchById: true,
        }),
      );
    } else {
      dispatch(
        fetchChapterAsync({ storyId: url, chapterNo, searchById: false }),
      );
      dispatch(fetchStoryByUrlAsync(url));
    }
  }, [chapterNo, dispatch, url]);

  useEffect(() => {
    if (story && story.url === url) {
      setShowStory(story);
    }
  }, [story, url]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [url, chapterNo]);

  const showChapter = chapter && chapter.chapterNo == chapterNo && chapter;
  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleReading" })} />
      <AppHeader />
      <Content>
        <ReadingMobile story={showStory} chapter={showChapter} />
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
