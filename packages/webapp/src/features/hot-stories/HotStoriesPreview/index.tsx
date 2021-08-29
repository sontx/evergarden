import { FormattedMessage } from "react-intl";
import { PreviewPanel } from "../../../components/PreviewPanel";
import useHotStories from "../hooks/useHotStories";
import { useStoriesWithMark } from "../hooks/useStoriesWithMark";

export function HotStoriesPreview() {
  const { data } = useHotStories(0);
  const stories = useStoriesWithMark(data);
  return (
    <PreviewPanel
      title={<FormattedMessage id="homeHotStories" />}
      stories={stories}
      onShowMore={() => {}}
    />
  );
}
