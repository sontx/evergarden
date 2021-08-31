import useLastUpdatedStories from "../hooks/useLastUpdatedStories";
import { FormattedMessage } from "react-intl";
import { PreviewPanel } from "../../../components/PreviewPanel";
import { useTwoDimensionsArray } from "../../../hooks/useTwoDimensionsArray";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectShowLastUpdatedStories,
  setShowFullLastUpdatedStories,
} from "../lastUpdatedSlice";
import { withInfiniteList } from "../../../components/FullPanel/withInfiniteList";
import { FullPanel } from "../../../components/FullPanel";

const Wrapper = withInfiniteList(FullPanel);

export function LastUpdatedPreview() {
  const { data } = useLastUpdatedStories(0);
  const dispatch = useAppDispatch();
  const stories = useTwoDimensionsArray(data?.pages);
  const showFull = useAppSelector(selectShowLastUpdatedStories);

  return (
    <>
      <PreviewPanel
        title={<FormattedMessage id="homeLastUpdated" />}
        stories={stories}
        onShowMore={() => dispatch(setShowFullLastUpdatedStories(true))}
      />
      {showFull && (
        <Wrapper
          query={useLastUpdatedStories}
          title={<FormattedMessage id="homeLastUpdated" />}
          onClose={() => dispatch(setShowFullLastUpdatedStories(false))}
        />
      )}
    </>
  );
}
