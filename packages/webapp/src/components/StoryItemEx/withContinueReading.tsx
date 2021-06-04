import { ElementType, useCallback } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { openReading } from "../../features/story/storySlice";

export function withContinueReading(Component: ElementType) {
  return (props: any) => {
    const dispatch = useAppDispatch();
    const history = useHistory();

    const handleClick = useCallback(
      (story) => {
        if (story.history) {
          dispatch(openReading(history, story, story.history.currentChapterNo));
        }
      },
      [dispatch, history],
    );

    return <Component {...props} onClick={handleClick} />;
  };
}
