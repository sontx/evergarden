import ReactMarkdown from "react-markdown";
import { MouseEventHandler, useEffect, useState } from "react";

import { getAbsoluteSize } from "../../utils/dom-utils";
import { useAppSelector } from "../../app/hooks";
import { selectStatus } from "../../features/story/storySlice";
import {StandardProps} from "rsuite/es/@types/common";
import classNames from "classnames";

export function ReadingPanel(props: {
  children: string | undefined;
  onClick?: MouseEventHandler;
  minHeightConfig?: {
    selectors: string[];
    containerVertPadding: number;
  };
} & StandardProps) {
  const { children, onClick, minHeightConfig, style = {}, className, ...rest } = props;
  const [minHeight, setMinHeight] = useState(0);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    if (status === "success") {
      if (minHeightConfig) {
        const calcMinHeight = minHeightConfig.selectors
          .map((selector) => {
            const element = document.querySelector(selector) as HTMLElement;
            return element ? getAbsoluteSize(element).height : 0;
          })
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          );
        setMinHeight(calcMinHeight + minHeightConfig.containerVertPadding);
      }
    }
  }, [minHeightConfig, status]);

  return (
    <div
      {...rest}
      style={{ minHeight: `calc(100vh - ${minHeight}px)`,  ...style}}
      className={classNames("reading-panel", className)}
      onClick={onClick}
    >
      <ReactMarkdown linkTarget="_blank">{children || ""}</ReactMarkdown>
    </div>
  );
}
