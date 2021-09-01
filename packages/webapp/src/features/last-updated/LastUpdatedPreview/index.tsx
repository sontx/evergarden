import useLastUpdatedStories from "../hooks/useLastUpdatedStories";
import { FormattedMessage } from "react-intl";
import { PreviewPanel } from "../../../components/PreviewPanel";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectShowLastUpdatedStories,
  setShowFullLastUpdatedStories,
} from "../lastUpdatedSlice";
import { withInfiniteList } from "../../../components/FullPanel/withInfiniteList";
import { FullPanel } from "../../../components/FullPanel";

const Wrapper = withInfiniteList(FullPanel);

export function LastUpdatedPreview() {
  const { data } = useLastUpdatedStories([0]);
  const dispatch = useAppDispatch();
  const showFull = useAppSelector(selectShowLastUpdatedStories);

  return (
    <>
      <PreviewPanel
        title={<FormattedMessage id="homeLastUpdated" />}
        stories={data?.pages && data.pages[0]}
        onShowMore={() => dispatch(setShowFullLastUpdatedStories(true))}
      />
      {showFull && (
        <Wrapper
          query={useLastUpdatedStories}
          initialQueryKey={[0]}
          title={<FormattedMessage id="homeLastUpdated" />}
          onClose={() => dispatch(setShowFullLastUpdatedStories(false))}
        />
      )}
    </>
  );
}
