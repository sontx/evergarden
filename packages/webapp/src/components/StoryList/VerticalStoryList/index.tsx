import { forwardRef } from "react";
import classNames from "classnames";
import { StoryListBaseProps } from "../index.api";

import { List } from "rsuite";

export const VerticalStoryList = forwardRef(
  (
    {
      className,
      stories,
      renderItem,
      renderSkeleton,
      skeletonCount,
      ...rest
    }: StoryListBaseProps,
    ref,
  ) => {
    return (
      <List
        className={classNames(className, "story-list--vertical")}
        {...rest}
        ref={ref as any}
      >
        {stories
          ? stories.map((story) => (
              <List.Item key={story.id}>{renderItem(story)}</List.Item>
            ))
          : Array.from(Array(skeletonCount || 10).keys()).map((value) => (
              <List.Item className="story-item-container" key={value}>{renderSkeleton()}</List.Item>
            ))}
      </List>
    );
  },
);
