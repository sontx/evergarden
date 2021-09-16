import { Icon, Nav, Panel } from "rsuite";
import { ChaptersPanel } from "../../chapters/ChaptersPanel";
import { Comment } from "../../../components/Comment";
import { useGoReading } from "../../../hooks/navigation/useGoReading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { GetStoryDto } from "@evergarden/shared";
import { MissingFeature } from "../../../components/MissingFeature";
import { FormattedMessage } from "react-intl";

export function StoryFooter({ story }: { story: GetStoryDto }) {
  const gotoReading = useGoReading();
  const { state = {} } = useLocation() as any;
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<
    "" | "chapters" | "reviews" | "comments"
  >("");
  const slug = useMemo(() => story?.url, [story?.url]);

  useEffect(() => {
    if (state.focusTo === "comment") {
      setActiveTab("comments");
    }
    history.replace(history.location.pathname);
  }, [history, state.focusTo]);

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

  return (
    <div className="story-footer">
      <Nav
        appearance="subtle"
        justified
        onSelect={setActiveTab}
        activeKey={activeTab}
      >
        <Nav.Item eventKey="chapters" icon={<Icon icon="list-ol" />}>
          <FormattedMessage id="chaptersPanelTitle" />
        </Nav.Item>
        <Nav.Item eventKey="reviews" icon={<Icon icon="star-half-o" />}>
          <FormattedMessage id="reviewsPanelTitle" />
        </Nav.Item>
        <Nav.Item eventKey="comments" icon={<Icon icon="comments" />}>
          <FormattedMessage id="commentsPanelTitle" />
        </Nav.Item>
      </Nav>
      <Panel
        onEntered={handleExpandPanel}
        className="chapter-panel"
        expanded={activeTab === "chapters"}
        collapsible
      >
        <ChaptersPanel
          fitHeight
          transparentToolbar
          story={story}
          hasFilterBar
          onClick={handleGoReading}
        />
      </Panel>
      <Panel
        id="comment-panel"
        className="comment-panel"
        onEntered={handleExpandPanel}
        expanded={activeTab === "comments"}
        collapsible
        defaultExpanded={state.focusTo === "comment"}
      >
        <Comment story={story} />
      </Panel>
      {activeTab === "reviews" && (
        <Panel className="review-panel">
          <MissingFeature />
        </Panel>
      )}
    </div>
  );
}
