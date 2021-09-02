import { ElementType, useCallback } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { openReading } from "../../features/story/storySlice";
import { useStoryHistory } from "../../features/histories/useStoryHistory";
import { StoryItemBaseProps } from "./index.api";

export function withHistory(Component: ElementType<StoryItemBaseProps>) {
  return ({ story: passStory, ...rest }: StoryItemBaseProps) => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const story = useStoryHistory(passStory);

    const handleClick = useCallback(
      (story) => {
        if (story.history) {
          dispatch(openReading(history, story, story.history.currentChapterNo));
        }
      },
      [dispatch, history],
    );

    return <Component {...rest} story={story} onClick={handleClick} />;
  };
}
