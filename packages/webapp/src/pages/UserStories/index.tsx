import { UserListStoriesPage } from "../../components/UserListStoriesPage";
import React, { useCallback } from "react";
import { UserStories } from "../../features/user-stories/UserStories";
import { Button } from "rsuite";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setStory } from "../../features/story-editor/storyEditorSlice";

export function UserStoriesPage() {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleCreateNew = useCallback(() => {
    dispatch(setStory(undefined));
    history.push("/user/story/new");
  }, [dispatch, history]);

  return (
    <UserListStoriesPage
      title="Your stories"
      action={
        <Button onClick={handleCreateNew} size="sm" appearance="link">
          Create new
        </Button>
      }
    >
      {(props) => <UserStories {...props} />}
    </UserListStoriesPage>
  );
}
