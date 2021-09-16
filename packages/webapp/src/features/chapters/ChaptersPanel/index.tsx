import { Icon, PanelGroup } from "rsuite";
import { ChapterRange } from "../ChapterRange";
import React, { Fragment, useMemo, useState } from "react";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { ChaptersPanelLoader } from "../ChaptersPanelLoader";
import { ChaptersToolBar } from "../ChaptersToolBar";
import { GetStoryDto } from "@evergarden/shared";

const MAX_CHAPTERS_PER_GROUP =
  process.env.NODE_ENV === "development" ? 100 : 100;
type SortType = "asc" | "desc";

function rangesMap(
  lastChapter: number,
  sort: SortType,
  callback: (from: number, to: number, index: number, value: number) => any,
) {
  let ranges = Array.from(
    Array(Math.ceil(lastChapter / MAX_CHAPTERS_PER_GROUP)).keys(),
  );
  if (sort === "desc") {
    ranges = ranges.reverse();
  }

  return ranges.map((value, index) => {
    const from = value * MAX_CHAPTERS_PER_GROUP + 1;
    const to =
      from +
      Math.min(
        MAX_CHAPTERS_PER_GROUP,
        lastChapter - value * MAX_CHAPTERS_PER_GROUP,
      ) -
      1;
    return callback(from, to, index, value);
  });
}

export function ChaptersPanel({
  story,
  className,
  onClick,
  defaultSort,
  hasFilterBar,
  currentChapterIntoView,
  transparentToolbar,
  fitHeight,
  ...rest
}: {
  story?: GetStoryDto;
  onClick?: (chapterNo: number) => void;
  defaultSort?: SortType;
  hasFilterBar?: boolean;
  currentChapterIntoView?: boolean;
  transparentToolbar?: boolean;
  fitHeight?: boolean;
} & StandardProps) {
  const [active, setActive] = useState(currentChapterIntoView ? -1 : 0);
  const [sort, setSort] = useState<SortType>(defaultSort || "desc");
  const currentChapterNo = useMemo(() => {
    return story?.history?.currentChapterNo;
  }, [story?.history?.currentChapterNo]);
  const [filter, setFilter] = useState<number | undefined>(
    currentChapterIntoView ? currentChapterNo : undefined,
  );

  const unreadFrom =
    typeof currentChapterNo === "number" && currentChapterNo > 0
      ? currentChapterNo + 1
      : 0;

  const activeKey = isFinite(filter as any) ? 0 : active;

  return (
    <div
      className={classNames(className, "chapters-panel", {
        "chapters-panel--fitHeight": fitHeight,
      })}
      {...rest}
    >
      {hasFilterBar && (
        <ChaptersToolBar
          defaultFilter={currentChapterIntoView ? currentChapterNo : undefined}
          transparent={transparentToolbar}
          onFilterChange={setFilter}
          story={story}
          sort={sort}
          onSortChange={setSort}
          onJumpTo={onClick}
        />
      )}
      {story ? (
        <PanelGroup accordion activeKey={activeKey} onSelect={setActive}>
          {story.lastChapter !== undefined &&
            rangesMap(story.lastChapter, sort, (from, to, index, value) => {
              let eventKey = index;
              const highlighted: number[] = [];
              if (
                filter !== undefined &&
                isFinite(filter) &&
                filter > 0 &&
                filter <= story.lastChapter!
              ) {
                if (from > filter || filter > to) {
                  return <Fragment key={value} />;
                }

                highlighted.push(filter);
                eventKey = 0;
              }

              return (
                <ChapterRange
                  onClick={onClick}
                  unreadFrom={unreadFrom}
                  highlighted={highlighted}
                  eventKey={eventKey}
                  sort={sort}
                  key={value}
                  from={from}
                  story={story}
                  to={to}
                  enabled={eventKey === activeKey}
                  renderMeta={(chapter) =>
                    !chapter.published ? (
                      <Icon icon="user-secret" />
                    ) : (
                      story.history?.currentChapterNo === chapter.chapterNo && (
                        <Icon icon="eye" />
                      )
                    )
                  }
                />
              );
            })}
        </PanelGroup>
      ) : (
        <ChaptersPanelLoader />
      )}
    </div>
  );
}
