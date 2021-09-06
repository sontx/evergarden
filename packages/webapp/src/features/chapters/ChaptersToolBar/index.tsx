import { Icon, IconButton, InputGroup, InputNumber } from "rsuite";
import { useCallback, useState } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { useIntl } from "react-intl";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { useDebouncedCallback } from "use-debounce";

export function ChaptersToolBar({
  story,
  onJumpTo,
  onSortChange,
  onFilterChange,
  className,
  ...rest
}: {
  story?: GetStoryDto;
  onJumpTo?: (chapterNo: number) => void;
  onSortChange?: (isDesc: boolean) => void;
  onFilterChange?: (chapterNo: number) => void;
} & StandardProps) {
  const [isDesc, setDesc] = useState(true);
  const [chapterNo, setChapterNo] = useState();
  const intl = useIntl();

  const handleSortClick = useCallback(() => {
    setDesc((prev) => {
      const newValue = !prev;
      if (onSortChange) {
        onSortChange(newValue);
      }
      return newValue;
    });
  }, [onSortChange]);

  const filterFn = useDebouncedCallback((value) => {
    if (onFilterChange) {
      onFilterChange(parseInt(`${value}`));
    }
  }, 500);

  const handleChapterNoChange = useCallback(
    (newValue) => {
      setChapterNo(newValue);
      filterFn(newValue);
    },
    [filterFn],
  );

  const maxChapterNo = story?.lastChapter || 0;

  return (
    <div className={classNames("chapters-toolbar", className)} {...rest}>
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
          placeholder={intl.formatMessage({ id: "filterChapterHint" })}
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
          <Icon icon="right" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
}
