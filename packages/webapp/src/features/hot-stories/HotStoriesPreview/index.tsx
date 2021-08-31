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
import { useTransformItems } from "../../../hooks/useTransformItems";
import { decorateWithRanking } from "../../../utils/story-ranking";

const Wrapper = withInfiniteList(FullPanel);

export function HotStoriesPreview() {
  const { data } = useHotStories(0);
  const dispatch = useAppDispatch();
  const stories = useTwoDimensionsArray(data?.pages);
  const markedStories = useTransformItems(stories, decorateWithRanking);
  const showFull = useAppSelector(selectShowFullHotStories);

  return (
    <>
      <PreviewPanel
        title={<FormattedMessage id="homeHotStories" />}
        stories={markedStories}
        onShowMore={() => dispatch(setShowFullHotStories(true))}
      />
      {showFull && (
        <Wrapper
          query={useHotStories}
          title={<FormattedMessage id="homeHotStories" />}
          onClose={() => dispatch(setShowFullHotStories(false))}
          transformItems={(items) => decorateWithRanking(items, 10)}
        />
      )}
    </>
  );
}
