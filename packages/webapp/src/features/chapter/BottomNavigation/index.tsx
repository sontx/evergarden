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
import { SettingPanel } from "../../settings/SettingPanel";
import { useGoNextChapter } from "../hooks/useGoNextChapter";
import { useGoBackChapter } from "../hooks/useGoBackChapter";
import { useToggle } from "../../../hooks/useToggle";
import { FullPanel } from "../../../components/FullPanel";
import { ChaptersPanel } from "../../chapters/ChaptersPanel";
import { useGoReading } from "../../../hooks/navigation/useGoReading";

export function BottomNavigation({
  story,
  chapter,
}: {
  story: GetStoryDto;
  chapter: GetChapterDto;
}) {
  const [showChapters, toggleShowChapters] = useToggle();
  const gotoNextChapter = useGoNextChapter();
  const gotoBackChapter = useGoBackChapter();
  const gotoReading = useGoReading();

  const handleNext = useCallback(() => {
    gotoNextChapter(story, chapter);
  }, [chapter, gotoNextChapter, story]);

  const handleBack = useCallback(() => {
    gotoBackChapter(story, chapter);
  }, [chapter, gotoBackChapter, story]);

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
              <SettingPanel />
            </div>
            <Divider style={{ margin: 0 }} />
          </div>
        )}
      </Animation.Collapse>
      <ButtonToolbar>
        <ButtonGroup justified>
          <Button onClick={handleBack} disabled={chapter.chapterNo <= 1}>
            <Icon size="lg" icon="arrow-circle-o-left" />
          </Button>
          <Button
            onClick={handleNext}
            disabled={chapter.chapterNo >= (story.lastChapter || 0)}
          >
            <Icon size="lg" icon="arrow-circle-right" />
          </Button>
          <Button onClick={toggleShowChapters}>
            <Icon size="lg" icon="list-ol" />
          </Button>
          <Button onClick={handleShowSettings}>
            <Icon size="lg" icon="font" />
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      {showChapters && (
        <FullPanel title={story.title} onClose={toggleShowChapters}>
          <ChaptersPanel
            slug={story.url}
            hasFilterBar
            currentChapterIntoView
            onClick={(chapterNo) => gotoReading(story, chapterNo)}
          />
        </FullPanel>
      )}
    </div>
  );
}
