import { GetPreviewChapterDto } from "@evergarden/shared";
import { List } from "rsuite";
import { ChapterHeader } from "../../../components/ChapterHeader";
import { isDesktop, isMobileOnly } from "react-device-detect";
import classNames from "classnames";
import { ReactNode, useLayoutEffect } from "react";
import moment from "moment";
import { scrollIntoHighlightedChapter } from "./utils";

export interface ChapterListBaseProps {
  sort: "asc" | "desc";
  renderMeta?: (chapter: Partial<GetPreviewChapterDto>) => ReactNode;
  onClick?: (chapterNo: number) => void;
  highlighted?: number[];
  unreadFrom?: number;
}

export interface ChapterListProps extends ChapterListBaseProps {
  chapters?: GetPreviewChapterDto[];
  skeletonFrom: number;
  skeletonTo: number;
}

export function ChapterList({
  chapters,
  skeletonFrom,
  skeletonTo,
  sort,
  renderMeta,
  onClick,
  highlighted,
  unreadFrom = 0,
}: ChapterListProps) {
  const sign = sort === "asc" ? 1 : -1;

  const renderItems = (chapters
    ? chapters
    : Array.from(Array(skeletonTo - skeletonFrom + 1).keys()).map((item) => ({
        chapterNo: skeletonFrom + item,
        published: true,
        created: undefined,
      }))
  ).sort((a, b) => (a.chapterNo - b.chapterNo) * sign);

  useLayoutEffect(() => {
    if (
      chapters &&
      chapters.length > 0 &&
      highlighted &&
      highlighted.length > 0
    ) {
      scrollIntoHighlightedChapter();
    }
  }, [chapters, highlighted]);

  return (
    <List className="chapter-list" size="sm" hover={isDesktop}>
      {renderItems.map((item) => (
        <List.Item
          key={item.chapterNo}
          onClick={() => {
            if (onClick) {
              onClick(item.chapterNo);
            }
          }}
          className={classNames({
            "chapter--highlighted": !!highlighted?.includes(item.chapterNo),
            "chapter--unread": item.chapterNo >= unreadFrom,
          })}
        >
          <span>
            <ChapterHeader chapter={item} />
            {!isMobileOnly && item.created && (
              <span className="chapter-created">
                ({moment(item.created).fromNow()})
              </span>
            )}
          </span>
          {renderMeta && <div className="meta">{renderMeta(item)}</div>}
        </List.Item>
      ))}
    </List>
  );
}
