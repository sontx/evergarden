import { AppNav } from "../../components/AppNav";
import { LastUpdatedStories } from "../../features/stories/LastUpdatedStories";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTab } from "../../features/settings/settingsSlice";
import { HotStories } from "../../features/stories/HotStories";
import { AppHeader } from "../../components/AppHeader";
import { Container, Content } from "rsuite";
import {AppFooter} from "../../components/AppFooter";

export function Home() {
  const currentTab = useAppSelector(selectCurrentTab);
  return (
    <Container>
      <AppHeader />
      <Content style={{ padding: "10px" }}>
        <AppNav />
        {currentTab === "updated" && <LastUpdatedStories />}
        {currentTab === "hot" && <HotStories />}
        {currentTab === "following" && <div>Following will coming soon</div>}
        {currentTab === "collection" && <div>Collection will coming soon</div>}
      </Content>
      <AppFooter/>
    </Container>
  );
}
