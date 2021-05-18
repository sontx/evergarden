import ReactMarkdown from "react-markdown";
import { MouseEventHandler } from "react";

import "./index.less";

export function ReadingPanel(props: {
  children: string;
  onClick?: MouseEventHandler;
}) {
  const { children, onClick } = props;
  return (
    <div className="reading-panel" onClick={onClick}>
      <ReactMarkdown linkTarget="_blank">{children}</ReactMarkdown>
    </div>
  );
}
