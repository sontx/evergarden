import React from "react";
import { AppHeader } from "../../components/AppHeader";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { SpotlightBanner } from "../../features/spotlight/SpotlightBanner";
import { LastUpdatedPreview } from "../../features/last-updated/LastUpdatedPreview";
import { EditorSuggestions } from "../../features/editor-suggestions/EditorSuggestions";
import { NewStoriesPreview } from "../../features/new-stories/NewStoriesPreview";
import { AppFooter } from "../../components/AppFooter";
import { HotStoriesPreview } from "../../features/hot-stories/HotStoriesPreview";
import { StopViewsPreview } from "../../features/top-views/TopViewPreview";
import { AppContent } from "../../components/AppContent";
import { RecommendStories } from "../../features/recommend/RecommendStories";
import { useIsLoggedIn } from "../../features/user/hooks/useIsLoggedIn";

export function Home() {
  const intl = useIntl();
  const isLoggedIn = useIsLoggedIn();

  return (
    <AppContainer showBackTop>
      <SEO title={intl.formatMessage({ id: "pageTitleHome" })} />
      <AppHeader fixedHeader />
      <AppContent flexFlow noPadding>
        <div>
          <SpotlightBanner />
          {isLoggedIn && <RecommendStories />}
          <LastUpdatedPreview />
          <HotStoriesPreview />
          <StopViewsPreview />
          <EditorSuggestions />
          <NewStoriesPreview />
        </div>
      </AppContent>
      <AppFooter />
    </AppContainer>
  );
}
