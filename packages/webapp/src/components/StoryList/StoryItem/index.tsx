import { GetStoryDto } from "@evergarden/shared";

import "./index.less";
import { HorizontalStoryItem } from "./HorizontalStoryItem";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { VerticalStoryItem } from "./VerticalStoryItem";
import { forwardRef } from "react";
import { CompactStoryItem } from "./CompactStoryItem";

export const StoryItem = forwardRef(
  (
    {
      story,
      layout = "compact",
      className,
      ...rest
    }: {
      story: GetStoryDto;
      layout?: "vertical" | "horizontal" | "compact";
    } & StandardProps,
    ref,
  ) => {
    const Renderer =
      layout === "vertical"
        ? VerticalStoryItem
        : layout === "horizontal"
        ? HorizontalStoryItem
        : CompactStoryItem;
    return (
      <Renderer
        ref={ref}
        story={story}
        className={classNames("story-item", className)}
        {...rest}
      />
    );
  },
);
