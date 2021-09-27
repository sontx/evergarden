import { useParams } from "react-router-dom";
import React from "react";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { Helmet } from "react-helmet";
import { AppContent } from "../../components/AppContent";
import { ReadingPanel } from "../../features/chapter/ReadingPanel";
import { useUserSettings } from "../../features/settings/hooks/useUserSettings";

export function Reading() {
  const { slug, chapterNo } = useParams() as any;
  const intl = useIntl();
  const { data: settings } = useUserSettings();

  return (
    <AppContainer showBackTop className="reading-page">
      <SEO title={intl.formatMessage({ id: "pageTitleReading" })} />
      <AppContent noPadding>
        <ReadingPanel slug={slug} chapterNo={parseInt(`${chapterNo}`)} />
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
