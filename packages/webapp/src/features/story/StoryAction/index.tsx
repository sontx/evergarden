import { GetStoryDto } from "@evergarden/shared";
import { ButtonGroup, Icon, IconButton } from "rsuite";
import { withFollowSync } from "../withFollowSync";
import { useCallback } from "react";
import { useGoReading } from "../../../hooks/navigation/useGoReading";
import { FormattedMessage } from "react-intl";
import { canContinueReading } from "../../../utils/story-utils";
import { useIsLoggedIn } from "../../user/hooks/useIsLoggedIn";

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
  const isLoggedIn = useIsLoggedIn();
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
      {isLoggedIn && <FollowButtonWrapper story={story} />}
      {!canContinueReading(story) && (
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
      {canContinueReading(story) && (
        <IconButton
          onClick={handleContinue}
          placement="right"
          icon={<Icon icon="angle-double-right" />}
          style={{ fontSize: "small" }}
          size="sm"
          appearance="primary"
        >
          <FormattedMessage
            id="continueReadingText"
            values={{ chapter: story.history?.currentChapterNo }}
          />
        </IconButton>
      )}
    </ButtonGroup>
  );
}
