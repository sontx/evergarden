import { PreviewPanel } from "../../../components/PreviewPanel";
import { FormattedMessage } from "react-intl";
import useNewStories from "../hooks/useNewStories";

const MAX_PREVIEW_NEW_STORIES = 3;

export function NewStoriesPreview() {
  const { data } = useNewStories(0, MAX_PREVIEW_NEW_STORIES);
  return (
    <PreviewPanel
      layout="vertical"
      skeletonCount={MAX_PREVIEW_NEW_STORIES}
      title={<FormattedMessage id="homeNewStories" />}
      stories={data}
      onShowMore={() => {}}
    />
  );
}
