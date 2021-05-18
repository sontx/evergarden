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

const { Paragraph } = Placeholder;

export function StoryPreviewMobile(props: { story?: GetStoryDto }) {
  const { story } = props;
  const intl = useIntl();
  const handleExpandPanel = useCallback((element) => {
    if (element) {
      (element as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, []);

  return story ? (
    <div className="story-preview-mobile-container">
      <Panel bodyFill>
        <img src={story.thumbnail} alt={story.title} />
        <Panel header={story.title}>
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
      <Divider style={{ marginTop: 0, marginBottom: "20px" }} />
      <StoryDetail story={story} />
      <ButtonGroup
        style={{
          paddingLeft: "20px",
          paddingRight: "20px",
          marginTop: "20px",
          marginBottom: "12px",
        }}
        justified
      >
        <IconButton
          placement="right"
          icon={<Icon icon="angle-right" />}
          style={{ fontSize: "small" }}
          size="sm"
        >
          Read
        </IconButton>
        <IconButton
          placement="right"
          icon={<Icon icon="angle-double-right" />}
          style={{ fontSize: "small" }}
          size="sm"
          appearance="primary"
        >
          Continue (112)
        </IconButton>
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
        onEntered={handleExpandPanel}
        defaultExpanded
        collapsible
        header={<CommentCount story={story} />}
      >
        <Comment story={story} />
      </Panel>
    </div>
  ) : (
    <Paragraph style={{ marginTop: 30 }} rows={5} graph="image" active />
  );
}
