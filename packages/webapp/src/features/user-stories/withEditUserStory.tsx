import { ElementType, useCallback } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { setStory } from "../story-editor/storyEditorSlice";

export function withEditUserStory(Component: ElementType) {
  return (props: any) => {
    const dispatch = useAppDispatch();
    const history = useHistory();

    const handleClick = useCallback(
      (story) => {
        if (story) {
          dispatch(setStory(story));
          history.push(`/user/stories/${story.url}`);
        }
      },
      [dispatch, history],
    );

    return <Component {...props} onClick={handleClick} />;
  };
}
