import {
  ButtonGroup,
  Divider,
  Icon,
  IconButton,
  Panel,
  Placeholder,
} from "rsuite";
import { GetStoryDto } from "@evergarden/shared";
// @ts-ignore
import ShowMoreText from "react-show-more-text";
import "./storyPreviewMobile.less";
import { useIntl } from "react-intl";
import { StoryDetail } from "./StoryDetail";
import { useCallback } from "react";
import { ChapterList } from "../chapters/ChapterList";
import { Comment } from "../../components/Comment/Comment";
import { CommentCount } from "../../components/Comment/CommentCount";
import { useHistory, useLocation } from "react-router-dom";
import { Reaction } from "../../components/Reaction";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { openReading } from "./storySlice";
import { withFollowSync } from "./withFollowSync";
import { selectHistory } from "../history/historySlice";
import { hasHistory } from "../../utils/types";

import defaultThumbnail from "../../images/violet-evergarden.jpg";

const { Paragraph } = Placeholder;

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

export function StoryPreviewMobile(props: { story?: GetStoryDto }) {
  const { story } = props;
  const intl = useIntl();
  const { state = {} } = useLocation() as any;
  const history = useHistory();
  const storyHistory = useAppSelector(selectHistory);

  const handleExpandPanel = useCallback((element) => {
    if (element) {
      (element as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, []);

  const handleCommentReady = useCallback(() => {
    if (state.focusTo === "comment") {
      const commentPanel = document.getElementById("comment-panel");
      if (commentPanel) {
        handleExpandPanel(commentPanel);
      }
    }
  }, [handleExpandPanel, state.focusTo]);

  const dispatch = useAppDispatch();

  const handleRead = useCallback(() => {
    if (story) {
      dispatch(openReading(history, story, 1));
    }
  }, [dispatch, history, story]);

  const handleContinue = useCallback(() => {
    if (story && hasHistory(storyHistory)) {
      dispatch(openReading(history, story, storyHistory.currentChapterNo));
    }
  }, [dispatch, history, story, storyHistory]);

  return story ? (
    <div className="story-preview-mobile-container">
      <Panel bodyFill>
        <img src={story.thumbnail || defaultThumbnail} alt={story.title} />
        <Panel header={story.title}>
          <div className="sub-header">
            <span>
              {intl.formatNumber(story.view)} readings |{" "}
              {intl.formatDate(story.created)}
            </span>
            <Reaction />
          </div>
          <Divider style={{ margin: "10px 0 15px 0" }} />
          <div className="story-preview-mobile-description">
            <ShowMoreText
              more={intl.formatMessage({ id: "showMore" })}
              lines={7}
              less={intl.formatMessage({ id: "showLess" })}
              expanded={false}
            >
              {story.description}
            </ShowMoreText>
          </div>
        </Panel>
      </Panel>
      <StoryDetail story={story} />
      <ButtonGroup
        style={{
          paddingLeft: "10px",
          paddingRight: "10px",
          marginTop: "20px",
          marginBottom: "15px",
        }}
        justified
      >
        {story && hasHistory(storyHistory) && <FollowButtonWrapper />}
        {story && !hasHistory(storyHistory) && (
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
        {story && hasHistory(storyHistory) && (
          <IconButton
            onClick={handleContinue}
            placement="right"
            icon={<Icon icon="angle-double-right" />}
            style={{ fontSize: "small" }}
            size="sm"
            appearance="primary"
          >
            {`Continue (${storyHistory.currentChapterNo})`}
          </IconButton>
        )}
      </ButtonGroup>
      <Panel
        onEntered={handleExpandPanel}
        className="story-preview-mobile-chapters"
        header="Chapters"
        collapsible
      >
        <ChapterList story={story} />
      </Panel>
      <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      <Panel
        id="comment-panel"
        className="story-preview-mobile-comment"
        onEntered={handleExpandPanel}
        collapsible
        defaultExpanded={state.focusTo === "comment"}
        header={<CommentCount story={story} />}
      >
        <Comment onReady={handleCommentReady} story={story} />
      </Panel>
    </div>
  ) : (
    <Paragraph style={{ marginTop: 30 }} rows={5} graph="image" active />
  );
}
