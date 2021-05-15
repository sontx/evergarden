import {AppNav} from "../../components/AppNav";
import {LastUpdatedStories} from "../../features/stories/LastUpdatedStories";
import React from "react";
import {useAppSelector} from "../../app/hooks";
import {selectCurrentTab} from "../../features/settings/settingsSlice";
import {HotStories} from "../../features/stories/HotStories";

export function Home() {
  const currentTab = useAppSelector(selectCurrentTab);
  return (
    <>
      <AppNav />
      {currentTab === "updated" && <LastUpdatedStories />}
      {currentTab === "hot" && <HotStories />}
      {currentTab === "following" && <div>Following will coming soon</div>}
      {currentTab === "collection" && <div>Collection will coming soon</div>}
    </>
  )
}
