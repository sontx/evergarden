import useLastUpdatedStories from "../hooks/useLastUpdatedStories";
import { FormattedMessage } from "react-intl";
import { PreviewPanel } from "../../../components/PreviewPanel";

export function LastUpdatedPreview() {
  const { data } = useLastUpdatedStories(0);
  return (
    <PreviewPanel
      title={<FormattedMessage id="homeLastUpdated" />}
      stories={data}
      onShowMore={() => {}}
    />
  );
}
