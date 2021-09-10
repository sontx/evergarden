import { PreviewPanel } from "../../../components/PreviewPanel";
import { FormattedMessage } from "react-intl";
import useNewStories from "../hooks/useNewStories";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectShowFullNewStories,
  setShowFullNewStories,
} from "../newStoriesSlice";
import { withInfiniteList } from "../../../components/FullPanel/withInfiniteList";
import { FullPanel } from "../../../components/FullPanel";

const MAX_PREVIEW_NEW_STORIES = 3;

const Wrapper = withInfiniteList(FullPanel);

export function NewStoriesPreview() {
  const { data } = useNewStories([0, MAX_PREVIEW_NEW_STORIES]);
  const dispatch = useAppDispatch();
  const showFull = useAppSelector(selectShowFullNewStories);

  return (
    <>
      <PreviewPanel
        layout="vertical"
        skeletonCount={MAX_PREVIEW_NEW_STORIES}
        title={<FormattedMessage id="homeNewStories" />}
        stories={data?.pages && data.pages[0]}
        onShowMore={() => dispatch(setShowFullNewStories(true))}
      />
      {showFull && (
        <Wrapper
          query={useNewStories}
          initialQueryKey={[0]}
          title={<FormattedMessage id="homeNewStories" />}
          onClose={() => dispatch(setShowFullNewStories(false))}
        />
      )}
    </>
  );
}
