import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { CSSProperties, useCallback, useRef } from "react";
import { Button, ButtonGroup, ButtonToolbar, Icon } from "rsuite";
import classNames from "classnames";
import { withFollowSync } from "../../story/withFollowSync";
import { useGoStory } from "../../../hooks/navigation/useGoStory";
import { ChapterHeader } from "../../../components/ChapterHeader";
import { useToggle } from "../../../hooks/useToggle";
import { useOverlay } from "../../../hooks/useOverlay";
import { UserMenu } from "../../../components/AppHeader/UserMenu";
import { useIsLoggedIn } from "../../user/hooks/useIsLoggedIn";
import { withActionHandler } from "../../../components/AppHeader/UserMenu/withActionHandler";

function FollowButton({ isFollowing, ...rest }: { isFollowing?: boolean }) {
  return (
    <Button {...rest}>
      <Icon style={isFollowing ? { color: "red" } : {}} icon="heart" />
    </Button>
  );
}

const FollowButtonWrapper = withFollowSync(FollowButton);
const UserMenuWrapper = withActionHandler(UserMenu);

export function TopNavigation({
  story,
  chapter,
}: {
  story: GetStoryDto;
  chapter: GetChapterDto;
}) {
  const [showMore, toggleShowMore] = useToggle();
  const [showMenu, toggleShowMenu] = useToggle();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isLoggedIn = useIsLoggedIn();
  const gotoStory = useGoStory();

  useOverlay();

  const handleClickBack = useCallback(() => {
    gotoStory(story);
  }, [gotoStory, story]);

  const handleClickComment = useCallback(() => {
    gotoStory(story, { focusTo: "comment" });
  }, [gotoStory, story]);

  const menuTop = containerRef.current?.clientHeight;

  return (
    <div className="top-navigation" ref={containerRef}>
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
              <ChapterHeader chapter={chapter} />
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
            <Button onClick={toggleShowMenu}>
              <Icon icon="bars" />
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      )}
      <UserMenuWrapper
        onClose={toggleShowMenu}
        show={showMenu}
        style={
          menuTop
            ? ({ "--grid-menu-top": `${menuTop}px` } as CSSProperties)
            : {}
        }
      />
    </div>
  );
}
