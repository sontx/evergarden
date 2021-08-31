import "./index.less";
import { StandardProps } from "rsuite/es/@types/common";
import { GetStoryDto } from "@evergarden/shared";
import { ReactNode } from "react";
import { Property } from "csstype";

export type GetStoryDtoEx = GetStoryDto & { mark?: StoryItemMarkOptions };

export interface StoryItemMarkOptions {
  text: ReactNode;
  backgroundColor: Property.BackgroundColor;
  value: number;
  spotlight?: boolean;
}

export interface StoryItemBaseProps extends StandardProps {
  story: GetStoryDtoEx;
}

export function hasUnreadChapter(story: GetStoryDto): boolean {
  return (
    !!story.history &&
    story.lastChapter !== undefined &&
    story.lastChapter > story.history.currentChapterNo
  );
}
