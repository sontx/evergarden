import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { useCallback, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Button, ButtonGroup, ButtonToolbar, Icon } from "rsuite";
import classNames from "classnames";
import { useAppDispatch } from "../../app/hooks";
import { openStory } from "../story/storySlice";
import { useHistory } from "react-router-dom";
import { withFollowSync } from "../story/withFollowSync";

function FollowButton({ isFollowing, ...rest }: { isFollowing?: boolean }) {
  return (
    <Button {...rest}>
      <Icon style={isFollowing ? { color: "red" } : {}} icon="heart" />
    </Button>
  );
}

const FollowButtonWrapper = withFollowSync(FollowButton);

export function getChapterDisplayName(
  chapter: GetChapterDto | undefined,
  intl: IntlShape,
): string {
  if (!chapter) {
    return "";
  }
  return chapter.title
    ? `${intl.formatMessage(
        { id: "chapterTitle" },
        { chapterNo: chapter.chapterNo },
      )}: ${chapter.title}`
    : intl.formatMessage(
        { id: "chapterTitle" },
        { chapterNo: chapter.chapterNo },
      );
}

export function ReadingNavigationTop(props: {
  story: GetStoryDto | undefined;
  chapter: GetChapterDto | undefined;
}) {
  const { story, chapter } = props;
  const [showMore, setShowMore] = useState(false);
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleClickBack = useCallback(() => {
    if (story) {
      dispatch(openStory(history, story));
    }
  }, [dispatch, history, story]);

  const handleClickMore = useCallback(() => {
    setShowMore((prevState) => !prevState);
  }, []);

  const handleClickComment = useCallback(() => {
    if (story) {
      dispatch(openStory(history, story, { focusTo: "comment" }));
    }
  }, [dispatch, history, story]);

  return (
    <div className="reading-navigation reading-navigation--top">
      <div className="reading-navigation-top-header">
        <Button onClick={handleClickBack} appearance="subtle">
          <Icon size="lg" icon="chevron-left" />
        </Button>
        <div className="reading-navigation-title">
          <div
            className={classNames({
              "reading-navigation-title--more": showMore,
            })}
          >
            {story?.title}
          </div>
          {showMore && (
            <div className="reading-navigation-title--sub">
              {getChapterDisplayName(chapter, intl)}
            </div>
          )}
        </div>
        <Button onClick={handleClickMore} appearance="subtle">
          <Icon size="lg" icon="more" />
        </Button>
      </div>
      {showMore && (
        <ButtonToolbar>
          <ButtonGroup justified>
            <Button>
              <Icon icon="download" />
            </Button>
            <Button onClick={handleClickComment}>
              <Icon icon="commenting" />
            </Button>
            <FollowButtonWrapper />
            <Button>
              <Icon icon="bug" />
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      )}
    </div>
  );
}
