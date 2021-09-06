import { Divider, Panel } from "rsuite";
import { useCallback } from "react";
import { Comment } from "../../../components/Comment/Comment";
import { CommentCount } from "../../../components/Comment/CommentCount";
import { useLocation } from "react-router-dom";

import defaultThumbnail from "../../../images/default-cover.png";
import { LazyImageEx } from "../../../components/LazyImageEx";
import { InfoGrid } from "../InfoGrid";
import { ChapterList } from "../../chapters/ChapterList1";
import { useStory } from "../hooks/useStory";
import { StorySubtitle } from "../StorySubtitle";
import { StoryDescription } from "../StoryDescription";
import { StoryAction } from "../StoryAction";
import { FormattedMessage } from "react-intl";
import { CuteLoader } from "../../../components/CuteLoader";
import { useAppSelector } from "../../../app/hooks";
import { selectIsDarkMode } from "../../global/globalSlice";

export function StoryPreview({ slug }: { slug: string }) {
  const { data: story } = useStory(slug);
  const { state = {} } = useLocation() as any;
  const darkMode = useAppSelector(selectIsDarkMode);

  const handleExpandPanel = useCallback((element) => {
    if (element) {
      (element as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
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

  return story ? (
    <div className="story-preview">
      <Panel bodyFill>
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
      <Panel
        onEntered={handleExpandPanel}
        className="chapter-panel"
        header={<FormattedMessage id="chaptersPanelTitle" />}
        collapsible
      >
        <ChapterList story={story} />
      </Panel>
      <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      <Panel
        id="comment-panel"
        className="comment-panel"
        onEntered={handleExpandPanel}
        collapsible
        defaultExpanded={state.focusTo === "comment"}
        header={<CommentCount story={story} />}
      >
        <Comment onReady={handleCommentReady} story={story} />
      </Panel>
    </div>
  ) : (
    <CuteLoader center dark={darkMode} />
  );
}
