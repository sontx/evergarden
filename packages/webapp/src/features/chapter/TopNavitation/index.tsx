import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { CSSProperties, useCallback, useEffect, useRef } from "react";
import { Button, ButtonGroup, ButtonToolbar, Icon } from "rsuite";
import classNames from "classnames";
import { withFollowSync } from "../../story/withFollowSync";
import { useGoStory } from "../../../hooks/navigation/useGoStory";
import { ChapterHeader } from "../../../components/ChapterHeader";
import { useToggle } from "../../../hooks/useToggle";
import { useOverlay } from "../../../hooks/useOverlay";
import { UserMenu } from "../../../components/AppHeader/UserMenu";
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
  slug,
  chapterNo,
}: {
  story?: GetStoryDto;
  chapter?: GetChapterDto;
  slug: string;
  chapterNo: number;
}) {
  const [showMore, toggleShowMore] = useToggle();
  const [showMenu, toggleShowMenu, setShowMenu] = useToggle();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gotoStory = useGoStory();

  useOverlay();

  useEffect(() => {
    if (!showMore) {
      setShowMenu(false);
    }
  }, [setShowMenu, showMore]);

  const handleClickBack = useCallback(() => {
    if (slug) {
      gotoStory(slug);
    }
  }, [gotoStory, slug]);

  const handleClickComment = useCallback(() => {
    if (slug) {
      gotoStory(slug, { focusTo: "comment" });
    }
  }, [gotoStory, slug]);

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
              "title-more": showMore,
            })}
          >
            {story?.title || (
              <span className="title--dump">
                {slug.replace(/-/g, " ").trim()}
              </span>
            )}
          </div>
          {showMore && (
            <div className="title-subtitle">
              <ChapterHeader chapter={chapter || { chapterNo }} />
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
            <Button disabled={!story}>
              <Icon icon="download" />
            </Button>
            <Button onClick={handleClickComment}>
              <Icon icon="comments" />
            </Button>
            {story && <FollowButtonWrapper story={story} />}
            <Button disabled={!chapter}>
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
