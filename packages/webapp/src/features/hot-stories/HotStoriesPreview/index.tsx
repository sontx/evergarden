import { FormattedMessage } from "react-intl";
import { PreviewPanel } from "../../../components/PreviewPanel";
import useHotStories from "../hooks/useHotStories";
import { useTwoDimensionsArray } from "../../../hooks/useTwoDimensionsArray";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { withInfiniteList } from "../../../components/FullPanel/withInfiniteList";
import { FullPanel } from "../../../components/FullPanel";
import {
  selectShowFullHotStories,
  setShowFullHotStories,
} from "../hotStoriesSlice";

const Wrapper = withInfiniteList(FullPanel);

export function HotStoriesPreview() {
  const { data } = useHotStories(0);
  const dispatch = useAppDispatch();
  const stories = useTwoDimensionsArray(data?.pages);
  const showFull = useAppSelector(selectShowFullHotStories);

  return (
    <>
      <PreviewPanel
        title={<FormattedMessage id="homeHotStories" />}
        stories={stories}
        onShowMore={() => dispatch(setShowFullHotStories(true))}
      />
      {showFull && (
        <Wrapper
          query={useHotStories}
          title={<FormattedMessage id="homeHotStories" />}
          onClose={() => dispatch(setShowFullHotStories(false))}
        />
      )}
    </>
  );
}
