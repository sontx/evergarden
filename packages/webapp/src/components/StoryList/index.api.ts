import { GetStoryDto } from "@evergarden/shared";
import { StandardProps } from "rsuite/es/@types/common";
import { ReactNode } from "react";

export interface StoryListBaseProps extends StandardProps {
  stories?: GetStoryDto[];
  renderItem: (story: GetStoryDto) => ReactNode;
  renderSkeleton: () => ReactNode;
}
