import { PreviewPanel } from "../../../components/PreviewPanel";
import { FormattedMessage } from "react-intl";
import useTopViewsStories from "../hooks/useTopViewsStories";
import { Button, ButtonGroup, ButtonToolbar } from "rsuite";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectShowFullTopViewStories,
  selectType,
  setShowFullTopViewStories,
  setType,
} from "../topViewsSlice";
import { ReactNode, useCallback } from "react";
import { useTransformItems } from "../../../hooks/useTransformItems";
import { decorateWithRanking } from "../../../utils/story-ranking";
import { withInfiniteList } from "../../../components/FullPanel/withInfiniteList";
import { FullPanel } from "../../../components/FullPanel";
import { TimeSubtitle } from "../TimeSubtitle";

function TypeButton({
  children,
  selectedName,
  name,
}: {
  children: ReactNode;
  name: string;
  selectedName: string;
}) {
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(setType(name));
  }, [dispatch, name]);
  const selected = name === selectedName;
  return (
    <Button
      onClick={handleClick}
      appearance={selected ? "primary" : "ghost"}
      size="xs"
    >
      {children}
    </Button>
  );
}

const Wrapper = withInfiniteList(FullPanel);

export function StopViewsPreview() {
  const type = useAppSelector(selectType);
  const dispatch = useAppDispatch();
  const { data, isFetching, isStale } = useTopViewsStories([0, type]);
  const stories = useTransformItems(
    data?.pages && data.pages[0],
    decorateWithRanking,
  );
  const showFull = useAppSelector(selectShowFullTopViewStories);

  return (
    <>
      <PreviewPanel
        layout="horizontal"
        title={<FormattedMessage id="homeTopViewsStories" />}
        stories={isFetching && !isStale ? undefined : stories}
        onShowMore={() => dispatch(setShowFullTopViewStories(true))}
        subHeader={
          <ButtonToolbar>
            <ButtonGroup disabled={!data} justified>
              <TypeButton name="today" selectedName={type}>
                <FormattedMessage id="homeTopViewsStoriesToday" />
              </TypeButton>
              <TypeButton name="week" selectedName={type}>
                <FormattedMessage id="homeTopViewsStoriesWeek" />
              </TypeButton>
              <TypeButton name="month" selectedName={type}>
                <FormattedMessage id="homeTopViewsStoriesMonth" />
              </TypeButton>
              <TypeButton name="year" selectedName={type}>
                <FormattedMessage id="homeTopViewsStoriesYear" />
              </TypeButton>
            </ButtonGroup>
          </ButtonToolbar>
        }
      />
      {showFull && (
        <Wrapper
          query={useTopViewsStories}
          initialQueryKey={[0, type]}
          title={<FormattedMessage id="homeTopViewsStories" />}
          subtitle={<TimeSubtitle type={type} />}
          onClose={() => dispatch(setShowFullTopViewStories(false))}
          transformItems={(items) => decorateWithRanking(items, 10)}
        />
      )}
    </>
  );
}
