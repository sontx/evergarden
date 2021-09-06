import { Icon, Modal } from "rsuite";
import { useCallback, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectStory } from "../../story/storySlice";
import { selectChapter } from "../../chapter/chapterSlice";
import { ChaptersPanel } from "../../../components/ChaptersPanel";
import { ChaptersToolBar } from "../ChaptersToolBar";
import { GetChapterDto } from "@evergarden/shared";
import { useGoReading } from "../../../hooks/navigation/useGoReading";

export function ChapterListModal(props: {
  show?: boolean;
  onClose?: () => void;
}) {
  const { show, onClose } = props;
  const story = useAppSelector(selectStory);
  const chapter = useAppSelector(selectChapter);
  const [isDesc, setDesc] = useState(true);
  const gotoReading = useGoReading();

  const handleChapterClick = useCallback(
    (clickedChapter: GetChapterDto | number) => {
      const chapterNo =
        typeof clickedChapter === "object"
          ? clickedChapter.chapterNo
          : clickedChapter;

      const isClickedOnCurrentChapter =
        chapter && chapter.chapterNo === chapterNo;

      if (isClickedOnCurrentChapter) {
        if (onClose) {
          onClose();
        }
      } else if (story) {
        gotoReading(story, chapterNo);
      }
    },
    [chapter, gotoReading, onClose, story],
  );

  return (
    <Modal
      className="chapter-list-modal-container"
      full
      show={show}
      onHide={onClose}
    >
      <Modal.Header
        closeButton={false}
        style={{ paddingRight: 0, display: "flex" }}
      >
        <ChaptersToolBar
          story={story}
          onJumpTo={handleChapterClick}
          onSortChange={setDesc}
        />
        <div style={{ padding: "8px 0 8px 15px" }} onClick={onClose}>
          <Icon icon="close" />
        </div>
      </Modal.Header>
      <Modal.Body>
        <ChaptersPanel
          sort={isDesc ? "9-0" : "0-9"}
          story={story}
          onSelect={handleChapterClick}
        />
      </Modal.Body>
    </Modal>
  );
}
