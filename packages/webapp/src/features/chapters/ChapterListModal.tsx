import { Icon, IconButton, InputGroup, InputNumber, Modal } from "rsuite";
import "./chapterListModal.less";
import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { openReading, selectStory } from "../story/storySlice";
import { selectChapter } from "../chapter/chapterSlice";
import { GetChapterDto } from "@evergarden/shared";
import { useHistory } from "react-router-dom";
import { ChaptersPanel } from "../../components/ChaptersPanel";

export function ChapterListModal(props: {
  show?: boolean;
  onClose?: () => void;
}) {
  const { show, onClose } = props;
  const [isDesc, setDesc] = useState(true);
  const story = useAppSelector(selectStory);
  const chapter = useAppSelector(selectChapter);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleSortClick = useCallback(() => {
    setDesc((prev) => !prev);
  }, []);

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

  const handleJump = useCallback(() => {
    const element = document.getElementById(
      "jump-chapter-numberbox",
    ) as HTMLInputElement;
    if (element) {
      const value = parseInt(element.value);
      if (isFinite(value)) {
        handleChapterClick(value);
      }
    }
  }, [handleChapterClick]);

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
        <IconButton
          className="sort-button"
          icon={
            <Icon icon={isDesc ? "sort-numeric-desc" : "sort-numeric-asc"} />
          }
          onClick={handleSortClick}
        />
        <InputGroup>
          <InputNumber
            max={story ? story.lastChapter : 0}
            min={1}
            id="jump-chapter-numberbox"
            placeholder="Jump to chapter"
          />
          <InputGroup.Button onClick={handleJump}>
            <Icon icon="angle-double-right" />
          </InputGroup.Button>
        </InputGroup>
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
