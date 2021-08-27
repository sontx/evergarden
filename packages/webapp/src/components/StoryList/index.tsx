import { ReactNode } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { StandardProps } from "rsuite/es/@types/common";
import { InfiniteStoryList } from "./InfiniteStoryList";

export interface StoryListBaseProps extends StandardProps {
  loadNext?: () => void;
  stories?: GetStoryDto[];
  loader?: ReactNode;
  hasMore?: boolean;
  dataLength?: number;
  renderItem: (story: GetStoryDto) => ReactNode;
  renderSkeleton?: () => ReactNode;
}

export function StoryList({
  layout,
  stories,
  ...rest
}: StoryListBaseProps & { layout?: "infinite" | "vertical" | "horizontal" }) {
  const Renderer = InfiniteStoryList;
  return <Renderer {...rest} stories={stories}/>;
}
