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
import { BackTop } from "../../components/BackTop";
import { useAppSelector } from "../../app/hooks";
import { selectIsLoggedIn } from "../../features/user/userSlice";
import { RecommendStories } from "../../features/recommend/RecommendStories";

export function Home() {
  const intl = useIntl();
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleHome" })} />
      <AppHeader fixedHeader />
      <AppContent flexFlow>
        <div>
          <SpotlightBanner />
          {isLoggedIn && <RecommendStories/>}
          <LastUpdatedPreview />
          <HotStoriesPreview />
          <StopViewsPreview />
          <EditorSuggestions />
          <NewStoriesPreview />
        </div>
        <BackTop/>
      </AppContent>
      <AppFooter />
    </AppContainer>
  );
}
