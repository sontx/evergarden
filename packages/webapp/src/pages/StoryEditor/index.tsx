import { StoryEditor } from "../../features/story-editor/StoryEditor";
import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory } from "../../features/story-editor/storyEditorSlice";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "rsuite";
import { openStory } from "../../features/story/storySlice";
import { withUpdateStory } from "./withUpdateStory";
import { UserPage } from "../../components/UserPage";

const Wrapper = withUpdateStory(UserPage);

export function StoryEditorPage() {
  const story = useAppSelector(selectStory);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { url } = useParams<{ url: string }>();

  const handleBack = useCallback(() => {
    history.push("/user/story");
  }, [history]);

  const handleView = useCallback(() => {
    if (story) {
      dispatch(openStory(history, story));
    }
  }, [dispatch, history, story]);

  const handleChapters = useCallback(() => {
    if (story) {
      history.push(`/user/story/${story.url}/chapter`);
    }
  }, [history, story]);

  const mode = !!url ? "update" : "create";

  return (
    <Wrapper
      title={mode === "update" ? "Update story" : "New story"}
      action={
        <>
          {mode === "update" && (
            <>
              <Button onClick={handleChapters} appearance="link" size="sm">
                Chapters
              </Button>
              <Button onClick={handleView} appearance="link" size="sm">
                View
              </Button>
            </>
          )}
          <Button onClick={handleBack} appearance="link" size="sm">
            Back
          </Button>
        </>
      }
    >
      <StoryEditor mode={mode} />
    </Wrapper>
  );
}
