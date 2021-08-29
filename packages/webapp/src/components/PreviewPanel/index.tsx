import { NavigateAction, StoryListHeader } from "../StoryListHeader";
import { StoryList } from "../StoryList";

import "./index.less";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { ReactNode } from "react";
import { GetStoryDtoEx } from "../StoryItem/index.api";

export function PreviewPanel({
  stories,
  className,
  title,
  onShowMore,
  layout,
  subHeader,
  ...rest
}: {
  stories?: GetStoryDtoEx[];
  title: ReactNode;
  subHeader?: ReactNode;
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
      <StoryList layout={layout || "horizontal"} stories={stories} />
    </div>
  );
}
