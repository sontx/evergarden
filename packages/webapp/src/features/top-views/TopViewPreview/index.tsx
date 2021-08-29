import { PreviewPanel } from "../../../components/PreviewPanel";
import { FormattedMessage } from "react-intl";
import useTopViewsStories from "../hooks/useTopViewsStories";
import { Button, ButtonGroup, ButtonToolbar } from "rsuite";
import { useStoriesWithMark } from "../../hot-stories/hooks/useStoriesWithMark";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectType, setType } from "../topViewsSlice";
import { ReactNode, useCallback } from "react";

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

export function StopViewsPreview() {
  const type = useAppSelector(selectType);
  const { data, isFetching } = useTopViewsStories(0, type);
  const stories = useStoriesWithMark(data);

  return (
    <PreviewPanel
      layout="horizontal"
      title={<FormattedMessage id="homeTopViewsStories" />}
      stories={isFetching ? undefined : stories}
      onShowMore={() => {}}
      subHeader={
        <ButtonToolbar>
          <ButtonGroup disabled={!data} justified>
            <TypeButton name="all" selectedName={type}>
              <FormattedMessage id="homeTopViewsStoriesAll" />
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
  );
}
