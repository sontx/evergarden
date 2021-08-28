import "./index.less";
import { StandardProps } from "rsuite/es/@types/common";
import { GetStoryDto } from "@evergarden/shared";
import { ReactNode } from "react";
import { Property } from "csstype";

export interface StoryItemMarkOptions {
  text: ReactNode;
  backgroundColor: Property.BackgroundColor;
  spotlight?: boolean;
}

export interface StoryItemBaseProps extends StandardProps {
  story: GetStoryDto;
  mark?: StoryItemMarkOptions;
}

export function hasUnreadChapter(story: GetStoryDto): boolean {
  return (
    !!story.history &&
    story.lastChapter !== undefined &&
    story.lastChapter > story.history.currentChapterNo
  );
}
