import classNames from "classnames";
import ReactMarkdown from "react-markdown";
import { StandardProps } from "rsuite/es/@types/common";

export type ReadingRendererProps = { content: string } & StandardProps;

export function ReadingRenderer({
  content,
  className,
  ...rest
}: ReadingRendererProps) {
  return (
    <div {...rest} className={classNames("reading-renderer", className)}>
      <ReactMarkdown linkTarget="_blank">{content}</ReactMarkdown>
    </div>
  );
}
