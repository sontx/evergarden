import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";
import { useIntl } from "react-intl";
import { AppContainer } from "../../components/AppContainer";
import { AppContent } from "../../components/AppContent";
import { StoryPreview } from "../../features/story/StoryPreview";

export function Story() {
  const { slug } = useParams() as any;
  const intl = useIntl();

  useEffect(() => {
    window.scroll({ top: 0 });
  }, []);

  return (
    <AppContainer backgroundEffect showBackTop>
      <SEO title={intl.formatMessage({ id: "pageTitleStory" })} />
      <AppHeader />
      <AppContent noPadding>
        <StoryPreview slug={slug} />
      </AppContent>
      <AppFooter />
    </AppContainer>
  );
}
