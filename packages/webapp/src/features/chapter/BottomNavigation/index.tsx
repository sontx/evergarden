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
import { ChapterListModal } from "../../chapters/ChapterListModal";
import { useGoNextChapter } from "../hooks/useGoNextChapter";
import { useGoBackChapter } from "../hooks/useGoBackChapter";

export function BottomNavigation({
  story,
  chapter,
}: {
  story: GetStoryDto;
  chapter: GetChapterDto;
}) {
  const [showChapterList, setShowChapterList] = useState(false);
  const gotoNextChapter = useGoNextChapter();
  const gotoBackChapter = useGoBackChapter();

  const handleNext = useCallback(() => {
    gotoNextChapter(story, chapter);
  }, [chapter, gotoNextChapter, story]);

  const handleBack = useCallback(() => {
    gotoBackChapter(story, chapter);
  }, [chapter, gotoBackChapter, story]);

  const handleShowChapters = useCallback(() => {
    setShowChapterList(true);
  }, []);
  const handleHideChapters = useCallback(() => {
    setShowChapterList(false);
  }, []);

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
          <Button
            onClick={handleBack}
            disabled={chapter.chapterNo <= 1}
          >
            <Icon size="lg" icon="arrow-circle-o-left" />
          </Button>
          <Button
            onClick={handleNext}
            disabled={chapter.chapterNo >= (story.lastChapter || 0)}
          >
            <Icon size="lg" icon="arrow-circle-right" />
          </Button>
          <Button onClick={handleShowChapters}>
            <Icon size="lg" icon="list-ol" />
          </Button>
          <Button onClick={handleShowSettings}>
            <Icon size="lg" icon="font" />
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      <ChapterListModal show={showChapterList} onClose={handleHideChapters} />
    </div>
  );
}
