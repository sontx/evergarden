import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { useCallback, useState } from "react";
import {
  Animation,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Divider,
  Icon,
} from "rsuite";
import { SettingPanel } from "../settings/SettingPanel";
import { openReading } from "../story/storySlice";
import { ChapterListModal } from "../chapters/ChapterListModal";

export function ReadingNavigationBottom(props: {
  story: GetStoryDto | undefined;
  chapter: GetChapterDto | undefined;
}) {
  const { story, chapter } = props;
  const history = useHistory();
  const [showChapterList, setShowChapterList] = useState(false);
  const dispatch = useAppDispatch();

  const handleNext = useCallback(() => {
    if (story && chapter) {
      dispatch(openReading(history, story, chapter.chapterNo + 1));
    }
  }, [chapter, dispatch, history, story]);

  const handleBack = useCallback(() => {
    if (story && chapter) {
      dispatch(openReading(history, story, chapter.chapterNo - 1));
    }
  }, [chapter, dispatch, history, story]);

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
    <div className="reading-nav reading-nav--bottom">
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
            disabled={!chapter || chapter.chapterNo <= 1}
          >
            <Icon size="lg" icon="arrow-circle-o-left" />
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              !chapter || !story || chapter.chapterNo >= (story.lastChapter || 0)
            }
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
