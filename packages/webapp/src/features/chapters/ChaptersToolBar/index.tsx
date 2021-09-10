import { Icon, IconButton, InputGroup, InputNumber } from "rsuite";
import { useCallback, useState } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { FormattedMessage, useIntl } from "react-intl";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { useDebouncedCallback } from "use-debounce";

type SortType = "desc" | "asc";

export function ChaptersToolBar({
  story,
  sort,
  onJumpTo,
  onSortChange,
  onFilterChange,
  className,
  ...rest
}: {
  story?: GetStoryDto;
  sort: SortType;
  onJumpTo?: (chapterNo: number) => void;
  onSortChange?: (sort: SortType) => void;
  onFilterChange?: (chapterNo: number) => void;
} & StandardProps) {
  const [chapterNo, setChapterNo] = useState();
  const intl = useIntl();

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
        icon={
          <Icon
            icon={sort === "desc" ? "sort-numeric-desc" : "sort-numeric-asc"}
          />
        }
        onClick={() => {
          if (onSortChange) {
            onSortChange(sort === "asc" ? "desc" : "asc");
          }
        }}
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
          <FormattedMessage id="filterChapterConfirm" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
}
