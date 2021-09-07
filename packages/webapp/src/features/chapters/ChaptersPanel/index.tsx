import { useStory } from "../../story/hooks/useStory";
import { Icon, PanelGroup } from "rsuite";
import { ChapterRange } from "../ChapterRange";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { ChaptersPanelLoader } from "../ChaptersPanelLoader";
import { ChaptersToolBar } from "../ChaptersToolBar";

const MAX_CHAPTERS_PER_GROUP =
  process.env.NODE_ENV === "development" ? 10 : 100;
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
  slug,
  className,
  onClick,
  defaultSort,
  hasFilterBar,
  currentChapterIntoView,
  ...rest
}: {
  slug: string;
  onClick?: (chapterNo: number) => void;
  defaultSort?: SortType;
  hasFilterBar?: boolean;
  currentChapterIntoView?: boolean;
} & StandardProps) {
  const { data: story } = useStory(slug);
  const [active, setActive] = useState(currentChapterIntoView ? -1 : 0);
  const [filter, setFilter] = useState<number | undefined>();
  const [sort, setSort] = useState<SortType>(defaultSort || "desc");
  const lastChapter = useMemo(() => story?.lastChapter, [story?.lastChapter]);
  const needShowCurrentChapter = useRef(currentChapterIntoView);
  const currentChapterNo = useMemo(() => {
    needShowCurrentChapter.current = true;
    return story?.history?.currentChapterNo;
  }, [story?.history?.currentChapterNo]);

  const unreadFrom =
    typeof currentChapterNo === "number" && currentChapterNo > 0
      ? currentChapterNo + 1
      : 0;

  useEffect(() => {
    if (
      lastChapter !== undefined &&
      currentChapterNo !== undefined &&
      currentChapterIntoView &&
      filter === undefined &&
      needShowCurrentChapter.current
    ) {
      rangesMap(lastChapter, sort, (from, to, index) => {
        if (currentChapterNo >= from && currentChapterNo <= to) {
          needShowCurrentChapter.current = false;
          setActive(index);
        }
      });
    }
  }, [lastChapter, currentChapterNo, currentChapterIntoView, filter, sort]);

  return (
    <div className={classNames(className, "chapters-panel")} {...rest}>
      {hasFilterBar && (
        <ChaptersToolBar
          onFilterChange={setFilter}
          story={story}
          sort={sort}
          onSortChange={setSort}
          onJumpTo={onClick}
          style={{ marginBottom: "20px" }}
        />
      )}
      {story ? (
        <PanelGroup accordion activeKey={active} onSelect={setActive}>
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
                  enabled={eventKey === active}
                  renderMeta={(chapter) =>
                    !chapter.published ? (
                      <Icon icon="user-secret" />
                    ) : (
                      story.history?.currentChapterNo === chapter.chapterNo && (
                        <Icon icon="book2" />
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
