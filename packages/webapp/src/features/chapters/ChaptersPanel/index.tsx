import { useStory } from "../../story/hooks/useStory";
import { Icon, PanelGroup } from "rsuite";
import { ChapterRange } from "../ChapterRange";
import React, { Fragment, useState } from "react";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { ChaptersPanelLoader } from "../ChaptersPanelLoader";
import { ChaptersToolBar } from "../ChaptersToolBar";

const MAX_CHAPTERS_PER_GROUP =
  process.env.NODE_ENV === "development" ? 10 : 100;

export function ChaptersPanel({
  slug,
  className,
  onClick,
  defaultSort,
  hasFilterBar,
  ...rest
}: {
  slug: string;
  onClick?: (chapterNo: number) => void;
  defaultSort?: "desc" | "asc";
  hasFilterBar?: boolean;
} & StandardProps) {
  const { data: story } = useStory(slug);
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState<number | undefined>();
  const [sort, setSort] = useState<"desc" | "asc">(defaultSort || "desc");

  let ranges =
    typeof story?.lastChapter === "number" &&
    Array.from(
      Array(Math.ceil(story.lastChapter / MAX_CHAPTERS_PER_GROUP)).keys(),
    );

  if (ranges && sort === "desc") {
    ranges = ranges.reverse();
  }

  const currentChapterNo = story?.history?.currentChapterNo;
  const unreadFrom =
    typeof currentChapterNo === "number" && currentChapterNo > 0
      ? currentChapterNo + 1
      : 0;

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
          {ranges &&
            ranges.map((value, index) => {
              const from = value * MAX_CHAPTERS_PER_GROUP + 1;
              const to =
                from +
                Math.min(
                  MAX_CHAPTERS_PER_GROUP,
                  story.lastChapter! - value * MAX_CHAPTERS_PER_GROUP,
                ) -
                1;

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
                    !chapter.published && <Icon icon="user-secret" />
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
