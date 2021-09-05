import { useParams } from "react-router-dom";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { Helmet } from "react-helmet";
import { selectUserSettings } from "../../features/user/userSlice";
import { defaultUserSettings } from "../../utils/user-settings-config";
import { AppContent } from "../../components/AppContent";
import { ReadingPanel } from "../../features/chapter/ReadingPanel";

export function Reading() {
  const { url, chapterNo } = useParams() as any;
  const intl = useIntl();
  const settings = useAppSelector(selectUserSettings) || defaultUserSettings;

  return (
    <AppContainer showBackTop>
      <SEO title={intl.formatMessage({ id: "pageTitleReading" })} />
      <AppContent noPadding>
        <ReadingPanel slug={url} chapterNo={parseInt(`${chapterNo}`)} />
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
