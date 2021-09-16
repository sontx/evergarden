import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { useCallback, useState } from "react";
import {
  Animation,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Divider,
  Icon,
} from "rsuite";
import { useGoNextChapter } from "../hooks/useGoNextChapter";
import { useGoBackChapter } from "../hooks/useGoBackChapter";
import { useToggle } from "../../../hooks/useToggle";
import { FullPanel } from "../../../components/FullPanel";
import { ChaptersPanel } from "../../chapters/ChaptersPanel";
import { useGoReading } from "../../../hooks/navigation/useGoReading";
import { SettingsPanel } from "../../settings/SettingsPanel";

export function BottomNavigation({
  story,
  chapter,
  chapterNo,
  slug,
}: {
  story?: GetStoryDto;
  chapter?: GetChapterDto;
  chapterNo: number;
  slug: string;
}) {
  const [showChapters, toggleShowChapters] = useToggle();
  const gotoNextChapter = useGoNextChapter();
  const gotoBackChapter = useGoBackChapter();
  const gotoReading = useGoReading();

  const handleNext = useCallback(() => {
    if (story && chapter) {
      gotoNextChapter(story, chapter);
    }
  }, [chapter, gotoNextChapter, story]);

  const handleBack = useCallback(() => {
    gotoBackChapter(slug, chapterNo);
  }, [chapterNo, gotoBackChapter, slug]);

  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const handleShowSettings = useCallback(() => {
    setShowSettingsPopup((prevState) => !prevState);
  }, []);

  return (
    <div className="bottom-navigation">
      <Animation.Collapse in={showSettingsPopup} unmountOnExit>
        {(props, ref) => (
          <div {...props} ref={ref}>
            <div style={{ padding: "20px" }}>
              <SettingsPanel />
            </div>
            <Divider style={{ margin: 0 }} />
          </div>
        )}
      </Animation.Collapse>
      <ButtonToolbar>
        <ButtonGroup justified>
          <Button
            onClick={handleBack}
            disabled={chapterNo <= 1}
          >
            <Icon size="lg" icon="arrow-circle-o-left" />
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              !chapter ||
              !story ||
              chapter.chapterNo >= (story.lastChapter || 0)
            }
          >
            <Icon size="lg" icon="arrow-circle-right" />
          </Button>
          <Button onClick={toggleShowChapters} disabled={!story}>
            <Icon size="lg" icon="list-ol" />
          </Button>
          <Button onClick={handleShowSettings}>
            <Icon size="lg" icon="font" />
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      {showChapters && story && (
        <FullPanel title={story.title} onClose={toggleShowChapters}>
          <ChaptersPanel
            story={story}
            hasFilterBar
            currentChapterIntoView
            onClick={(chapterNo) => gotoReading(story, chapterNo)}
          />
        </FullPanel>
      )}
    </div>
  );
}
