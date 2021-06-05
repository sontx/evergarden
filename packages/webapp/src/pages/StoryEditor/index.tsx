import { StoryEditor } from "../../features/story-editor/StoryEditor";
import React, { useCallback, useEffect } from "react";
import { UserPage } from "../../components/UserPage";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchUserStoryAsync,
  selectStory,
} from "../../features/story-editor/storyEditorSlice";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "rsuite";
import { openStory } from "../../features/story/storySlice";

export function StoryEditorPage() {
  const story = useAppSelector(selectStory);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { url } = useParams<{ url: string }>();

  useEffect(() => {
    if ((!story || story.url !== url) && url) {
      dispatch(fetchUserStoryAsync(url));
    }
  }, [dispatch, story, url]);

  const handleBack = useCallback(() => {
    history.push("/user/story");
  }, [history]);

  const handleView = useCallback(() => {
    if (story) {
      dispatch(openStory(history, story));
    }
  }, [dispatch, history, story]);

  const mode = !!url ? "update" : "create";

  return (
    <UserPage
      title={mode === "update" ? "Update story" : "New story"}
      action={
        <>
          {mode === "update" && (
            <Button onClick={handleView} appearance="link" size="sm">
              View
            </Button>
          )}
          <Button onClick={handleBack} appearance="link" size="sm">
            Back
          </Button>
        </>
      }
    >
      <StoryEditor mode={mode} />
    </UserPage>
  );
}
