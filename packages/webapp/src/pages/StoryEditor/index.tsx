import { StoryEditor } from "../../features/story-editor/StoryEditor";
import React from "react";
import { UserPage } from "../../components/UserPage";
import { useAppSelector } from "../../app/hooks";
import { selectStory } from "../../features/story-editor/storyEditorSlice";

export function StoryEditorPage() {
  const story = useAppSelector(selectStory);

  return (
    <UserPage title={story ? "Update story" : "New story"}>
      <StoryEditor />
    </UserPage>
  );
}
