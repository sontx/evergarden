import { ElementType, useCallback } from "react";
import { StoryItemBaseProps } from "./index.api";
import { useGoStory } from "../../hooks/navigation/useGoStory";
import { useGoReading } from "../../hooks/navigation/useGoReading";

export function withAction(
  Component: ElementType<StoryItemBaseProps>,
  prefer: "continueReading" | "showDetail" = "showDetail",
) {
  return ({ story, ...rest }: StoryItemBaseProps) => {
    const gotoStory = useGoStory();
    const gotoReading = useGoReading();

    const handleClick = useCallback(
      (story) => {
        if (
          prefer === "continueReading" &&
          story.history &&
          typeof story.history.currentChapterNo === "number"
        ) {
          gotoReading(story, story.history.currentChapterNo);
        } else {
          gotoStory(story);
        }
      },
      [gotoReading, gotoStory],
    );

    return <Component {...rest} story={story} onClick={handleClick} />;
  };
}
