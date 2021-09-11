import { Divider, Panel } from "rsuite";

import defaultThumbnail from "../../../images/default-cover.png";
import { LazyImageEx } from "../../../components/LazyImageEx";
import { InfoGrid } from "../InfoGrid";
import { useStory } from "../hooks/useStory";
import { StorySubtitle } from "../StorySubtitle";
import { StoryDescription } from "../StoryDescription";
import { StoryAction } from "../StoryAction";
import { CuteLoader } from "../../../components/CuteLoader";
import { useIsDarkMode } from "../../global/hooks/useIsDarkMode";
import { StoryFooter } from "../StoryFooter";

export function StoryPreview({ slug }: { slug: string }) {
  const { data: story } = useStory(slug);
  const { isDarkMode } = useIsDarkMode();

  return story ? (
    <div className="story-preview">
      <Panel bodyFill className="story-header">
        <LazyImageEx
          src={story.cover}
          defaultSrc={defaultThumbnail}
          alt={story.title}
        />
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
    <CuteLoader center dark={isDarkMode} />
  );
}
