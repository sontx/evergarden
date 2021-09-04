import { ElementType, useCallback } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { openReading, openStory } from "../../features/story/storySlice";
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
          if (
            story.history.currentChapterNo &&
            story.history.currentChapterNo > 0
          ) {
            dispatch(
              openReading(history, story, story.history.currentChapterNo),
            );
          } else {
            dispatch(openStory(history, story));
          }
        }
      },
      [dispatch, history],
    );

    return <Component {...rest} story={story} onClick={handleClick} />;
  };
}
