import { ReadingMobile } from "../../features/chapter/ReadingMobile";
import { useHistory, useParams } from "react-router-dom";
import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchStoryAsync, selectStory } from "../../features/story/storySlice";
import {
  fetchChapterAsync,
  selectChapter,
  selectErrorMessage,
  selectStatus,
} from "../../features/chapter/chapterSlice";
import { AppHeader } from "../../components/AppHeader";
import { Button, Content, Icon } from "rsuite";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { FormattedMessage, useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { Helmet } from "react-helmet";
import { selectReadingFont } from "../../features/settings/settingsSlice";
import { selectIsLoggedIn } from "../../features/auth/authSlice";
import { withCachedNextChapter } from "./withCachedNextChapter";
import { withReadingHistorySync } from "./withReadingHistorySync";
import { withTracker } from "./withTracker";
import { openModal } from "../../components/EnhancedModal";

const CachedReading = withCachedNextChapter(withTracker(ReadingMobile));
const ReadingWrapper = withReadingHistorySync(CachedReading);

export function Reading() {
  const { url, chapterNo } = useParams() as any;
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const readingFont = useAppSelector(selectReadingFont);
  const chapter = useAppSelector(selectChapter);
  const story = useAppSelector(selectStory);
  const status = useAppSelector(selectStatus);
  const errorMessage = useAppSelector(selectErrorMessage);
  const history = useHistory();

  useEffect(() => {
    if (!story || story.url !== url) {
      dispatch(fetchStoryAsync(url));
    }
  }, [dispatch, story, url]);

  const showStory = story && story.url === url ? story : undefined;
  const showChapter =
    chapter && showStory && chapter.storyId === showStory.id
      ? chapter
      : undefined;

  const goBack = useCallback(() => {
    history.goBack()
  }, [history]);

  useEffect(() => {
    if (status === "error" && errorMessage) {
      openModal({
        title: errorMessage.code,
        message: errorMessage.prettierMessage,
        ok: intl.formatMessage({ id: "goBackButton" }),
        className: "model--mobile",
        icon: (
          <Icon
            icon="remind"
            style={{
              color: "#ffb300",
            }}
          />
        ),
        onOk: goBack,
      });
    }
  }, [status, errorMessage, intl, history, goBack]);

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
        {status !== "error" ? (
          isLoggedIn ? (
            <ReadingWrapper story={showStory} chapter={showChapter} />
          ) : (
            <CachedReading story={showStory} chapter={showChapter} />
          )
        ) : (
          <Button className="center-thing" onClick={goBack} appearance="primary">
            <FormattedMessage id="goBackButton" />
          </Button>
        )}
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
