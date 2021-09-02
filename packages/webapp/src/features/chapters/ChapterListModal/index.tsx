import { Icon, Modal } from "rsuite";
import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { openReading, selectStory } from "../../story/storySlice";
import { selectChapter } from "../../chapter/chapterSlice";
import { useHistory } from "react-router-dom";
import { ChaptersPanel } from "../../../components/ChaptersPanel";
import { ChaptersToolBar } from "../../../components/ChaptersToolBar";
import { GetChapterDto } from "@evergarden/shared";

export function ChapterListModal(props: {
  show?: boolean;
  onClose?: () => void;
}) {
  const { show, onClose } = props;
  const story = useAppSelector(selectStory);
  const chapter = useAppSelector(selectChapter);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [isDesc, setDesc] = useState(true);

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
        dispatch(openReading(history, story, chapterNo));
      }
    },
    [chapter, dispatch, history, onClose, story],
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
