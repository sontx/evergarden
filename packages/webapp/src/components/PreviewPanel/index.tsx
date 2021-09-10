import { StoryListHeader } from "../FullPanel/StoryListHeader";
import { StoryList } from "../StoryList";

import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { ReactNode } from "react";
import { GetStoryDtoEx } from "../StoryItem/index.api";
import { NavigateAction } from "../FullPanel/NavigateAction";

export function PreviewPanel({
  stories,
  className,
  title,
  onShowMore,
  layout,
  subHeader,
  skeletonCount,
  ...rest
}: {
  stories?: GetStoryDtoEx[];
  title: ReactNode;
  subHeader?: ReactNode;
  skeletonCount?: number;
  onShowMore?: () => void;
  layout?: "vertical" | "horizontal";
} & StandardProps) {
  return (
    <div className={classNames(className, "preview-panel")} {...rest}>
      <StoryListHeader
        title={title}
        action={onShowMore && <NavigateAction onClick={onShowMore} />}
      />
      {subHeader && <div className="subHeader">{subHeader}</div>}
      <StoryList
        layout={layout || "horizontal"}
        skeletonCount={skeletonCount}
        stories={stories}
      />
    </div>
  );
}
