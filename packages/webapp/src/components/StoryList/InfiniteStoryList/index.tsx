import { forwardRef, ReactNode } from "react";
import { GetStoryDto } from "@evergarden/shared";
import classNames from "classnames";

import { List } from "rsuite";
import { StoryListBaseProps } from "../index.api";
import { EnhancedInfiniteLoader } from "../../EnhancedInfiniteLoader";

export interface InfiniteStoryListProps extends StoryListBaseProps {
  loadNext: (start: number, stop: number) => Promise<void> | null;
  hasMore: boolean;
  renderItem: (story: GetStoryDto) => ReactNode;
  itemHeight: number;
  isNextPageLoading: boolean;
}

export const InfiniteStoryList = forwardRef(
  (
    {
      loadNext,
      stories,
      hasMore,
      renderItem,
      className,
      renderSkeleton,
      skeletonCount,
      itemHeight,
      isNextPageLoading,
      ...rest
    }: InfiniteStoryListProps,
    ref,
  ) => {
    return (
      <div
        {...rest}
        ref={ref as any}
        className={classNames(className, "story-list--infinite")}
      >
        <EnhancedInfiniteLoader
          items={stories || []}
          itemHeight={itemHeight}
          loadNextPage={loadNext}
          renderItem={(index, story, style) => (
            <List.Item key={story.id} style={style}>
              {renderItem(story)}
            </List.Item>
          )}
          hasNextPage={hasMore}
          isNextPageLoading={isNextPageLoading}
          renderLoader={(style) => (
            <div style={style}>
              {Array.from(Array(skeletonCount || 10).keys()).map((value) => (
                <List.Item key={value}>{renderSkeleton()}</List.Item>
              ))}
            </div>
          )}
        />
      </div>
    );
  },
);
