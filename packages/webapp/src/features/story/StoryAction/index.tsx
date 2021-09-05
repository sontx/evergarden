import { GetStoryDto } from "@evergarden/shared";
import { ButtonGroup, Icon, IconButton } from "rsuite";
import { withFollowSync } from "../withFollowSync";
import { useAppSelector } from "../../../app/hooks";
import { selectIsLoggedIn } from "../../user/userSlice";
import { useCallback } from "react";
import { useGoReading } from "../../../hooks/navigation/useGoReading";

function FollowButton({ isFollowing, ...rest }: { isFollowing?: boolean }) {
  return (
    <IconButton
      placement="right"
      icon={
        isFollowing ? (
          <Icon style={{ color: "red" }} icon="heart" />
        ) : (
          <Icon icon="heart-o" />
        )
      }
      style={{ fontSize: "small" }}
      size="sm"
      {...rest}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </IconButton>
  );
}

const FollowButtonWrapper = withFollowSync(FollowButton);

export function StoryAction({ story }: { story: GetStoryDto }) {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const gotoReading = useGoReading();

  const handleRead = useCallback(() => {
    if (story) {
      gotoReading(story, 1);
    }
  }, [gotoReading, story]);

  const handleContinue = useCallback(() => {
    if (story && story.history) {
      gotoReading(story, story.history.currentChapterNo);
    }
  }, [gotoReading, story]);

  return (
    <ButtonGroup className="story-action" justified>
      {story && isLoggedIn && <FollowButtonWrapper story={story} />}
      {story &&
        (!story.history || story.history.currentChapterNo === undefined) && (
          <IconButton
            placement="right"
            icon={<Icon icon="angle-right" />}
            style={{ fontSize: "small" }}
            size="sm"
            onClick={handleRead}
          >
            Read
          </IconButton>
        )}
      {story && story.history && story.history.currentChapterNo !== undefined && (
        <IconButton
          onClick={handleContinue}
          placement="right"
          icon={<Icon icon="angle-double-right" />}
          style={{ fontSize: "small" }}
          size="sm"
          appearance="primary"
        >
          {`Continue (${story.history.currentChapterNo})`}
        </IconButton>
      )}
    </ButtonGroup>
  );
}
