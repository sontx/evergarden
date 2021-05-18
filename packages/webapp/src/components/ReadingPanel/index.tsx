import ReactMarkdown from "react-markdown";
import { MouseEventHandler, useEffect, useState } from "react";

import "./index.less";
import { getAbsoluteSize } from "../../utils/dom-utils";
import { useAppSelector } from "../../app/hooks";
import { selectStatus } from "../../features/story/storySlice";

export function ReadingPanel(props: {
  children: string;
  onClick?: MouseEventHandler;
  minHeightConfig?: {
    selectors: string[];
    containerVertPadding: number;
  };
}) {
  const { children, onClick, minHeightConfig } = props;
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
      style={{ minHeight: `calc(100vh - ${minHeight}px)` }}
      className="reading-panel"
      onClick={onClick}
    >
      <ReactMarkdown linkTarget="_blank">{children}</ReactMarkdown>
    </div>
  );
}
