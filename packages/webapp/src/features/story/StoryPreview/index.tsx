import { Divider, Panel } from "rsuite";

import defaultThumbnail from "../../../images/default-cover.png";
import { LazyImageEx } from "../../../components/LazyImageEx";
import { InfoGrid } from "../InfoGrid";
import { useStory } from "../hooks/useStory";
import { StorySubtitle } from "../StorySubtitle";
import { StoryDescription } from "../StoryDescription";
import { StoryAction } from "../StoryAction";
import { CuteLoader } from "../../../components/CuteLoader";
import { StoryFooter } from "../StoryFooter";

export function StoryPreview({ slug }: { slug: string }) {
  const { data: story } = useStory(slug);

  return story ? (
    <div className="story-preview">
      <Panel bodyFill className="story-header">
        <div className="cover">
          <LazyImageEx
            src={story.cover}
            defaultSrc={defaultThumbnail}
            alt={story.title}
          />
        </div>
        <Panel header={story.title}>
          <StorySubtitle story={story} />
          <Divider style={{ margin: "10px 0 15px 0" }} />
          <StoryDescription story={story} />
        </Panel>
      </Panel>
      <InfoGrid story={story} />
      <StoryAction story={story} />
      <StoryFooter story={story} />
    </div>
  ) : (
    <CuteLoader center />
  );
}
