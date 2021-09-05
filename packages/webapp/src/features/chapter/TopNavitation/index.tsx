import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { useCallback } from "react";
import { Button, ButtonGroup, ButtonToolbar, Icon } from "rsuite";
import classNames from "classnames";
import { useAppSelector } from "../../../app/hooks";
import { withFollowSync } from "../../story/withFollowSync";
import { selectIsLoggedIn } from "../../user/userSlice";
import { useGoStory } from "../../../hooks/navigation/useGoStory";
import { ChapterTitle } from "../../../components/ChapterTitle";
import { useToggle } from "../../../hooks/useToggle";
import { useOverlay } from "../../../hooks/useOverlay";

function FollowButton({ isFollowing, ...rest }: { isFollowing?: boolean }) {
  return (
    <Button {...rest}>
      <Icon style={isFollowing ? { color: "red" } : {}} icon="heart" />
    </Button>
  );
}

const FollowButtonWrapper = withFollowSync(FollowButton);

export function TopNavigation({
  story,
  chapter,
}: {
  story: GetStoryDto;
  chapter: GetChapterDto;
}) {
  const [showMore, toggleShowMore] = useToggle();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const gotoStory = useGoStory();

  useOverlay();

  const handleClickBack = useCallback(() => {
    gotoStory(story);
  }, [gotoStory, story]);

  const handleClickComment = useCallback(() => {
    gotoStory(story, { focusTo: "comment" });
  }, [gotoStory, story]);

  return (
    <div className="top-navigation">
      <div className="header">
        <span className="action" onClick={handleClickBack}>
          <Icon size="lg" icon="left" />
        </span>
        <div className="title">
          <div
            className={classNames({
              "title--more": showMore,
            })}
          >
            {story.title}
          </div>
          {showMore && (
            <div className="title--sub">
              <ChapterTitle chapter={chapter} />
            </div>
          )}
        </div>
        <span className="action" onClick={toggleShowMore}>
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
