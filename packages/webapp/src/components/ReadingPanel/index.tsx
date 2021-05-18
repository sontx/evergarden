import ReactMarkdown from "react-markdown";

export function ReadingPanel(props: { children: string }) {
  const { children } = props;
  return <ReactMarkdown>{children}</ReactMarkdown>;
}
