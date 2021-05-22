import {
  ButtonGroup,
  Divider,
  Icon,
  IconButton,
  Panel,
  Placeholder,
} from "rsuite";
import { GetStoryDto, GetStoryHistoryDto } from "@evergarden/shared";
// @ts-ignore
import ShowMoreText from "react-show-more-text";
import "./storyPreviewMobile.less";
import { useIntl } from "react-intl";
import { StoryDetail } from "./StoryDetail";
import { useCallback } from "react";
import { ChapterList } from "../chapters/ChapterList";
import { Comment } from "../../components/Comment/Comment";
import { CommentCount } from "../../components/Comment/CommentCount";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { Reaction } from "../../components/Reaction";

const { Paragraph } = Placeholder;

export function StoryPreviewMobile(props: {
  story?: GetStoryDto;
  storyHistory?: GetStoryHistoryDto;
}) {
  const { story, storyHistory } = props;
  const intl = useIntl();
  const { state = {} } = useLocation() as any;

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

  const history = useHistory();

  const handleRead = useCallback(() => {
    if (story) {
      history.push(`/reading/${story.url}/1`, { story, storyHistory });
    }
  }, [history, story, storyHistory]);

  const handleContinue = useCallback(() => {
    if (story && storyHistory) {
      history.push(`/reading/${story.url}/${storyHistory.currentChapterNo}`, {
        story,
        storyHistory
      });
    }
  }, [history, story, storyHistory]);

  return story ? (
    <div className="story-preview-mobile-container">
      <Panel bodyFill>
        <img src={story.thumbnail} alt={story.title} />
        <Panel header={story.title}>
          <div className="sub-header">
            <span>
              {intl.formatNumber(story.view)} readings |{" "}
              {intl.formatDate(story.created)}
            </span>
            <Reaction />
          </div>
          <Divider style={{margin: "10px 0 15px 0"}}/>
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
        <IconButton
          placement="right"
          icon={<Icon icon="angle-right" />}
          style={{ fontSize: "small" }}
          size="sm"
          onClick={handleRead}
        >
          Read
        </IconButton>
        {storyHistory && (
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
        <ChapterList story={story} storyHistory={storyHistory}/>
      </Panel>
      <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      <Panel
        id="comment-panel"
        className="story-preview-mobile-comment"
        onEntered={handleExpandPanel}
        defaultExpanded
        collapsible
        header={<CommentCount story={story} />}
      >
        <Comment onReady={handleCommentReady} story={story} />
      </Panel>
    </div>
  ) : (
    <Paragraph style={{ marginTop: 30 }} rows={5} graph="image" active />
  );
}
