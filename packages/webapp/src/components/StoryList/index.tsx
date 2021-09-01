import { StoryListBaseProps } from "./index.api";
import { withAnimation } from "../StoryItem/withAnimation";
import {
  CompactStoryItem,
  CompactStoryItemSkeleton,
  HorizontalStoryItem,
  HorizontalStoryItemSkeleton,
  VerticalStoryItem,
  VerticalStoryItemSkeleton,
} from "../StoryItem";
import { withHistory } from "../StoryItem/withHistory";
import { InfiniteStoryList } from "./InfiniteStoryList";
import { VerticalStoryList } from "./VerticalStoryList";
import { ElementType, forwardRef } from "react";
import { StoryItemBaseProps } from "../StoryItem/index.api";
import classNames from "classnames";

import "./index.less";
import { HorizontalStoryList } from "./HorizontalStoryList";

const CompactItem = withHistory(withAnimation(CompactStoryItem));
const HorizontalItem = withHistory(withAnimation(HorizontalStoryItem));
const VerticalItem = withHistory(VerticalStoryItem);

export interface StoryListProps
  extends Omit<StoryListBaseProps, "renderSkeleton" | "renderItem"> {
  layout: "compact" | "vertical" | "horizontal";
}

export const StoryList = forwardRef(({ layout, className, ...rest }: StoryListProps, ref) => {
  let ListComponent: ElementType<StoryListBaseProps>;
  let ItemComponent: ElementType<StoryItemBaseProps>;
  let SkeletonComponent: ElementType;
  if (layout === "compact") {
    ListComponent = InfiniteStoryList;
    ItemComponent = CompactItem;
    SkeletonComponent = CompactStoryItemSkeleton;
  } else if (layout === "vertical") {
    ListComponent = VerticalStoryList;
    ItemComponent = HorizontalItem;
    SkeletonComponent = HorizontalStoryItemSkeleton;
  } else {
    ListComponent = HorizontalStoryList;
    ItemComponent = VerticalItem;
    SkeletonComponent = VerticalStoryItemSkeleton;
  }

  return (
    <ListComponent
      ref={ref}
      className={classNames("story-list", className)}
      renderItem={(story) => <ItemComponent story={story} />}
      renderSkeleton={() => <SkeletonComponent />}
      {...rest}
    />
  );
})
