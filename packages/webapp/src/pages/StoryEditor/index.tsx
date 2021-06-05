import { StoryEditor } from "../../features/story-editor/StoryEditor";
import React, { useEffect } from "react";
import { UserPage } from "../../components/UserPage";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchUserStoryAsync,
  selectStory,
} from "../../features/story-editor/storyEditorSlice";
import { useParams } from "react-router-dom";

export function StoryEditorPage() {
  const story = useAppSelector(selectStory);
  const dispatch = useAppDispatch();
  const { url } = useParams<{ url: string }>();

  useEffect(() => {
    if ((!story || story.url !== url) && url) {
      dispatch(fetchUserStoryAsync(url));
    }
  }, [dispatch, story, url]);

  const mode = !!url ? "update" : "create";

  return (
    <UserPage title={mode === "update" ? "Update story" : "New story"}>
      <StoryEditor mode={mode} />
    </UserPage>
  );
}
