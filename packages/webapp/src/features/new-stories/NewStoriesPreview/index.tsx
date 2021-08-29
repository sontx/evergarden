import { PreviewPanel } from "../../../components/PreviewPanel";
import { FormattedMessage } from "react-intl";
import useNewStories from "../hooks/useNewStories";

export function NewStoriesPreview() {
  const { data } = useNewStories(0, 3);
  return (
    <PreviewPanel
      layout="vertical"
      title={<FormattedMessage id="homeNewStories" />}
      stories={data}
      onShowMore={() => {}}
    />
  );
}
