import { Icon, Nav, Panel } from "rsuite";
import { ChaptersPanel } from "../../chapters/ChaptersPanel";
import { Comment } from "../../../components/Comment";
import { useGoReading } from "../../../hooks/navigation/useGoReading";
import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { GetStoryDto } from "@evergarden/shared";
import { MissingFeature } from "../../../components/MissingFeature";
import { FormattedMessage } from "react-intl";

export function StoryFooter({ story }: { story: GetStoryDto }) {
  const gotoReading = useGoReading();
  const { state = {} } = useLocation() as any;
  const [activeTab, setActiveTab] = useState<
    "" | "chapters" | "reviews" | "comments"
  >("");
  const slug = useMemo(() => story?.url, [story?.url]);

  const handleGoReading = useCallback(
    (chapterNo: number) => {
      gotoReading(slug, chapterNo);
    },
    [gotoReading, slug],
  );

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

  return (
    <div className="story-footer">
      <Nav
        appearance="subtle"
        justified
        onSelect={setActiveTab}
        activeKey={activeTab}
      >
        <Nav.Item eventKey="chapters" icon={<Icon icon="list-ol" />}>
          <FormattedMessage id="chaptersPanelTitle"/>
        </Nav.Item>
        <Nav.Item eventKey="reviews" icon={<Icon icon="star-half-o" />}>
          <FormattedMessage id="reviewsPanelTitle"/>
        </Nav.Item>
        <Nav.Item eventKey="comments" icon={<Icon icon="comments" />}>
          <FormattedMessage id="commentsPanelTitle"/>
        </Nav.Item>
      </Nav>
      <Panel
        onEntered={handleExpandPanel}
        className="chapter-panel"
        expanded={activeTab === "chapters"}
        collapsible
      >
        <ChaptersPanel slug={slug} hasFilterBar onClick={handleGoReading} />
      </Panel>
      <Panel
        id="comment-panel"
        className="comment-panel"
        onEntered={handleExpandPanel}
        expanded={activeTab === "comments"}
        collapsible
        defaultExpanded={state.focusTo === "comment"}
      >
        <Comment onReady={handleCommentReady} story={story} />
      </Panel>
      {activeTab === "reviews" && (
        <Panel className="review-panel">
          <MissingFeature/>
        </Panel>
      )}
    </div>
  );
}
