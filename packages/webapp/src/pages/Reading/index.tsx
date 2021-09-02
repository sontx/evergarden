import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchStoryAsync,
  selectErrorMessage as selectStoryErrorMessage,
  selectStatus as selectStoryStatus,
  selectStory,
} from "../../features/story/storySlice";
import {
  fetchChapterAsync,
  selectChapter,
  selectErrorMessage,
  selectStatus,
} from "../../features/chapter/chapterSlice";
import { Button } from "rsuite";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { FormattedMessage, useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { Helmet } from "react-helmet";
import { withCachedNextChapter } from "./withCachedNextChapter";
import { withReadingHistorySync } from "./withReadingHistorySync";
import { withTracker } from "./withTracker";
import { withHttpErrorCatch } from "../../HOCs/withHttpErrorCatch";
import {
  selectIsLoggedIn,
  selectUserSettings,
} from "../../features/user/userSlice";
import { defaultUserSettings } from "../../utils/user-settings-config";
import { AppContent } from "../../components/AppContent";
import { ReadingMobile } from "../../features/chapter/ReadingMobile";

const CachedReading = withCachedNextChapter(withTracker(ReadingMobile));
const ReadingWrapper = withReadingHistorySync(CachedReading);
function ErrorPanel({ goBack }: { goBack: () => void }) {
  return (
    <Button className="center-thing" onClick={goBack} appearance="primary">
      <FormattedMessage id="goBackButton" />
    </Button>
  );
}
const WrapperErrorPanel = withHttpErrorCatch(ErrorPanel);

export function Reading() {
  const { url, chapterNo } = useParams() as any;
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const settings = useAppSelector(selectUserSettings) || defaultUserSettings;
  const chapter = useAppSelector(selectChapter);
  const story = useAppSelector(selectStory);
  const chapterStatus = useAppSelector(selectStatus);
  const chapterErrorMessage = useAppSelector(selectErrorMessage);
  const storyStatus = useAppSelector(selectStoryStatus);
  const storyErrorMessage = useAppSelector(selectStoryErrorMessage);

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

  useEffect(() => {
    if (showStory) {
      dispatch(fetchChapterAsync({ storyId: showStory.id, chapterNo }));
    }
  }, [chapterNo, dispatch, showStory]);

  return (
    <AppContainer className="reading-theme--dark1" showBackTop>
      <SEO title={intl.formatMessage({ id: "pageTitleReading" })} />
      <AppContent noPadding>
        {chapterStatus !== "error" && storyStatus !== "error" ? (
          isLoggedIn ? (
            <ReadingWrapper story={showStory} chapter={showChapter} />
          ) : (
            <CachedReading story={showStory} chapter={showChapter} />
          )
        ) : (
          <WrapperErrorPanel
            status="error"
            errorMessage={
              chapterStatus === "error"
                ? chapterErrorMessage
                : storyErrorMessage
            }
          />
        )}
      </AppContent>
      <AppFooter />
      <Helmet>
        <link
          href={`https://fonts.googleapis.com/css?family=${settings.readingFont}`}
          rel="stylesheet"
        />
      </Helmet>
    </AppContainer>
  );
}
