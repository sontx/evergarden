import { Icon, IconButton, InputGroup, InputNumber } from "rsuite";
import { useCallback, useState } from "react";
import { GetStoryDto } from "@evergarden/shared";

export function ChaptersToolBar({
  story,
  onJumpTo,
  onSortChange,
}: {
  story?: GetStoryDto;
  onJumpTo?: (chapterNo: number) => void;
  onSortChange?: (isDesc: boolean) => void;
}) {
  const [isDesc, setDesc] = useState(true);
  const [chapterNo, setChapterNo] = useState();

  const handleSortClick = useCallback(() => {
    setDesc((prev) => {
      const newValue = !prev;
      if (onSortChange) {
        onSortChange(newValue);
      }
      return newValue;
    });
  }, [onSortChange]);

  const handleChapterNoChange = useCallback((newValue) => {
    setChapterNo(newValue);
  }, []);

  const maxChapterNo = story?.lastChapter || 0;

  return (
    <div className="chapter-toolbar-container">
      <IconButton
        className="sort-button"
        icon={<Icon icon={isDesc ? "sort-numeric-desc" : "sort-numeric-asc"} />}
        onClick={handleSortClick}
      />
      <InputGroup>
        <InputNumber
          value={chapterNo}
          onChange={handleChapterNoChange}
          max={maxChapterNo}
          min={1}
          placeholder="Jump to chapter"
        />
        <InputGroup.Button
          onClick={() => {
            const selectChapterNo = parseInt(`${chapterNo}`);
            if (
              onJumpTo &&
              isFinite(selectChapterNo) &&
              selectChapterNo > 0 &&
              selectChapterNo <= maxChapterNo
            ) {
              onJumpTo(selectChapterNo);
            }
          }}
        >
          <Icon icon="angle-double-right" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
}
