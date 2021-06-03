import { StoryEditor } from "../../features/story-editor/StoryEditor";
import { SEO } from "../../components/SEO";
import { AppHeader } from "../../components/AppHeader";
import { Content } from "rsuite";
import { AppFooter } from "../../components/AppFooter";
import { AppContainer } from "../../components/AppContainer";
import React from "react";

export function StoryEditorPage() {
  return (
    <AppContainer>
      <SEO title="New story" />
      <AppHeader />
      <Content style={{ padding: "10px" }}>
        <StoryEditor />
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
