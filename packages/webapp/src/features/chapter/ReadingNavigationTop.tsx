import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { useCallback, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Button, ButtonGroup, ButtonToolbar, Icon } from "rsuite";
import classNames from "classnames";
import { useAppSelector } from "../../app/hooks";
import { withFollowSync } from "../story/withFollowSync";
import { selectIsLoggedIn } from "../user/userSlice";
import { useGoStory } from "../../hooks/navigation/useGoStory";

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
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const intl = useIntl();
  const gotoStory = useGoStory();

  const handleClickBack = useCallback(() => {
    if (story) {
      gotoStory(story);
    }
  }, [gotoStory, story]);

  const handleClickMore = useCallback(() => {
    setShowMore((prevState) => !prevState);
  }, []);

  const handleClickComment = useCallback(() => {
    if (story) {
      gotoStory(story, { focusTo: "comment" });
    }
  }, [gotoStory, story]);

  return (
    <div className="reading-nav reading-nav--top">
      <div className="header">
        <span className="action" onClick={handleClickBack}>
          <Icon size="lg" icon="chevron-left" />
        </span>
        <div className="title">
          <div
            className={classNames({
              "title--more": showMore,
            })}
          >
            {story?.title}
          </div>
          {showMore && (
            <div className="title--sub">
              {getChapterDisplayName(chapter, intl)}
            </div>
          )}
        </div>
        <span className="action" onClick={handleClickMore}>
          <Icon size="lg" icon="more" />
        </span>
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
            {story && isLoggedIn && <FollowButtonWrapper story={story} />}
            <Button>
              <Icon icon="bug" />
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      )}
    </div>
  );
}
