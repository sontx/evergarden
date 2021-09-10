import { FormattedMessage } from "react-intl";
import { PreviewPanel } from "../../../components/PreviewPanel";
import useRecommendedStories from "../hooks/useRecommendedStories";

export function RecommendStories() {
  const { data } = useRecommendedStories();
  return (
    <PreviewPanel
      title={<FormattedMessage id="homeRecommendedStories" />}
      stories={data}
    />
  );
}
