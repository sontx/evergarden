import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory } from "../../features/story-editor/storyEditorSlice";
import { useHistory, useParams } from "react-router-dom";
import { Icon, IconButton } from "rsuite";
import { openStory } from "../../features/story/storySlice";
import { withUpdateStory } from "./withUpdateStory";
import { UserPage } from "../../components/UserPage";
import { StoryEditor } from "../../features/story-editor/StoryEditor";

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
    history.push(`/user/story/${url}/chapter`);
  }, [history, url]);

  const mode = !!url ? "update" : "create";

  return (
    <Wrapper
      title={mode === "update" ? "Update story" : "New story"}
      action={
        <>
          {mode === "update" && (
            <>
              <IconButton
                icon={<Icon icon="list" />}
                onClick={handleChapters}
                appearance="link"
                size="sm"
              />
              <IconButton
                icon={<Icon icon="eye" />}
                onClick={handleView}
                appearance="link"
                size="sm"
              />
            </>
          )}
          <IconButton
            icon={<Icon icon="close" />}
            onClick={handleBack}
            appearance="link"
            size="sm"
          />
        </>
      }
    >
      <StoryEditor mode={mode} />
    </Wrapper>
  );
}
