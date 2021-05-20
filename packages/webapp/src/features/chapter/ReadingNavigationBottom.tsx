import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { useHistory } from "react-router";
import { useAppSelector } from "../../app/hooks";
import { selectStatus } from "./chapterSlice";
import { useCallback, useState } from "react";
import {
  Animation,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Divider,
  Icon,
} from "rsuite";
import { ChapterListModal } from "../chapters/ChapterListModal";
import { SettingPanel } from "../settings/SettingPanel";

export function ReadingNavigationBottom(props: {
  story: GetStoryDto;
  chapter: GetChapterDto;
}) {
  const { story, chapter } = props;
  const history = useHistory();
  const status = useAppSelector(selectStatus);
  const [showChapterList, setShowChapterList] = useState(false);

  const handleNext = useCallback(() => {
    history.push(`/reading/${story.url}/${chapter.chapterNo + 1}`);
  }, [chapter, history, story]);

  const handleBack = useCallback(() => {
    history.push(`/reading/${story.url}/${chapter.chapterNo - 1}`);
  }, [chapter, history, story]);

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
    <div className="reading-navigation reading-navigation--bottom">
      <Animation.Collapse in={showSettingsPopup}>
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
            disabled={status === "processing" || chapter.chapterNo <= 1}
          >
            <Icon size="lg" icon="arrow-circle-o-left" />
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              status === "processing" || chapter.chapterNo >= story.lastChapter
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
