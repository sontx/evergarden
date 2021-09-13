import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, ButtonToolbar, Icon } from "rsuite";
import classNames from "classnames";
import { withFollowSync } from "../../story/withFollowSync";
import { useGoStory } from "../../../hooks/navigation/useGoStory";
import { ChapterHeader } from "../../../components/ChapterHeader";
import { useToggle } from "../../../hooks/useToggle";
import { useOverlay } from "../../../hooks/useOverlay";
import { UserMenu } from "../../../components/AppHeader/UserMenu";
import { withActionHandler } from "../../../components/AppHeader/UserMenu/withActionHandler";
import { FormReportBug } from "../FormReportBug";

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
  const [showMenu, toggleShowMenu, setShowMenu] = useToggle();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gotoStory = useGoStory();
  const [showFormReport, setShowFormReport] = useState(false);

  useOverlay();

  useEffect(() => {
    if (!showMore) {
      setShowMenu(false);
    }
  }, [setShowMenu, showMore]);

  const handleClickBack = useCallback(() => {
    gotoStory(story);
  }, [gotoStory, story]);

  const handleClickComment = useCallback(() => {
    gotoStory(story, { focusTo: "comment" });
  }, [gotoStory, story]);

  const handleShowFormReportBug = useCallback(() => {
    setShowFormReport((prevState) => !prevState);
  }, []);

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
              <Icon icon="comments" />
            </Button>
            {story && <FollowButtonWrapper story={story} />}
            <Button onClick={handleShowFormReportBug}>
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
      {showFormReport && (
        <FormReportBug
          chapter={chapter}
          show={showFormReport}
          onClose={handleShowFormReportBug}
        ></FormReportBug>
      )}
    </div>
  );
}
