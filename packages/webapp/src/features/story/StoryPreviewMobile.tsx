import { Divider, Panel, Placeholder } from "rsuite";
import { GetStoryDto } from "@evergarden/shared";
// @ts-ignore
import ShowMoreText from "react-show-more-text";
import "./storyPreviewMobile.less";
import { useIntl } from "react-intl";
import { StoryDetail } from "./StoryDetail";

const { Paragraph, Grid } = Placeholder;

export function StoryPreviewMobile(props: { story?: GetStoryDto }) {
  const { story } = props;
  const intl = useIntl();
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
      <Divider style={{ marginTop: "20px", marginBottom: "12px" }} />
      <Panel
        className="story-preview-mobile-chapters"
        header="Chapters"
        collapsible
      >
        <Grid rows={7} active />
      </Panel>
    </div>
  ) : (
    <Paragraph style={{ marginTop: 30 }} rows={5} graph="image" active />
  );
}
