import { ElementType, useCallback } from "react";
import { useStoryHistory } from "../../features/histories/hooks/useStoryHistory";
import { StoryItemBaseProps } from "./index.api";
import { useGoStory } from "../../hooks/navigation/useGoStory";

export function withHistory(Component: ElementType<StoryItemBaseProps>) {
  return ({ story: passStory, ...rest }: StoryItemBaseProps) => {
    const story = useStoryHistory(passStory);
    const gotoStory = useGoStory();

    const handleClick = useCallback(
      (story) => {
        if (story.history) {
          gotoStory(story);
        }
      },
      [gotoStory],
    );

    return <Component {...rest} story={story} onClick={handleClick} />;
  };
}
