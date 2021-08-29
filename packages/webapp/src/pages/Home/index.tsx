import React from "react";
import { AppHeader } from "../../components/AppHeader";
import { Content } from "rsuite";
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

export function Home() {
  const intl = useIntl();

  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleHome" })} />
      <AppHeader />
      <Content
        style={{ padding: "10px", display: "flex", flexDirection: "column" }}
      >
        <div>
          <SpotlightBanner />
          <LastUpdatedPreview />
          <HotStoriesPreview />
          <StopViewsPreview />
          <EditorSuggestions />
          <NewStoriesPreview />
        </div>
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
