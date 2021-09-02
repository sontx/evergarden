import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Divider, Icon, List, Placeholder } from "rsuite";
import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import AutoSizer from "react-virtualized-auto-sizer";
import { ReactNode, useEffect, useRef } from "react";

import InfiniteLoader from "react-window-infinite-loader";
import { fetchRangeChapters } from "../../features/chapters/chaptersAPI";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";

export function ChapterSub({ chapter }: { chapter: GetChapterDto }) {
  return (
    <div className="chapter-sub">
      {chapter.title && (
        <>
          <span>{chapter.title}</span>
          <Divider vertical />
        </>
      )}
      <span>{moment(chapter.updated).fromNow()}</span>
    </div>
  );
}

let CHAPTERS_DATA: (GetChapterDto | number)[] = [];

const getChapterNo = (item: GetChapterDto | number) =>
  typeof item === "object" ? item.chapterNo : item;

export function ChaptersPanel({
  story,
  onSelect,
  renderAction,
  renderItemSub,
  sort = "9-0",
  className,
  style,
}: {
  story?: GetStoryDto;
  onSelect: (chapter: GetChapterDto | number) => void;
  renderItemSub?: (chapter: GetChapterDto | number) => ReactNode;
  renderAction?: (chapter: GetChapterDto | number) => ReactNode;
  sort?: "0-9" | "9-0";
} & StandardProps) {
  const infiniteLoaderRef = useRef<InfiniteLoader | null>(null);

  useEffect(() => {
    if (story) {
      CHAPTERS_DATA = Array.from(Array(story.lastChapter).keys()).map(
        (num) => num + 1,
      );
      switch (sort) {
        case "0-9":
          CHAPTERS_DATA.sort(
            (item1, item2) => getChapterNo(item1) - getChapterNo(item2),
          );
          break;
        case "9-0":
          CHAPTERS_DATA.sort(
            (item1, item2) => getChapterNo(item2) - getChapterNo(item1),
          );
          break;
      }
      if (infiniteLoaderRef.current) {
        infiniteLoaderRef.current?.forceUpdate();
        infiniteLoaderRef.current.resetloadMoreItemsCache(true);
      }
    }
  }, [story, sort]);

  const fetchMore = async (
    startIndex: number,
    stopIndex: number,
  ): Promise<any> => {
    if (!story) {
      return;
    }

    const result = await fetchRangeChapters(
      story.id,
      startIndex,
      stopIndex - startIndex + 1,
      sort === "0-9" ? "asc" : "desc",
    );

    const items = result.items;
    for (let i = startIndex; i <= stopIndex; i++) {
      CHAPTERS_DATA[i] = items[i - startIndex];
    }
  };

  const isItemLoaded = (index: number) =>
    typeof CHAPTERS_DATA[index] === "object";

  return (
    <AutoSizer
      className={classNames("chapters-panel-container", className)}
      style={style}
    >
      {({ height, width }: { height: number; width: number }) => (
        <InfiniteLoader
          ref={infiniteLoaderRef}
          isItemLoaded={isItemLoaded}
          loadMoreItems={fetchMore}
          minimumBatchSize={10}
          itemCount={CHAPTERS_DATA.length}
        >
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              onItemsRendered={onItemsRendered}
              ref={ref}
              layout="vertical"
              height={height}
              itemCount={CHAPTERS_DATA.length}
              itemData={CHAPTERS_DATA}
              itemSize={53}
              width={width}
              innerElementType={(listProps) => (
                <List {...listProps} size="sm" />
              )}
            >
              {(itemProps: ListChildComponentProps) => {
                const data = itemProps.data[itemProps.index];
                return (
                  data && (
                    <List.Item
                      key={itemProps.index}
                      style={itemProps.style}
                      onClick={() => onSelect(data)}
                    >
                      <div>
                        <div>
                          <FormattedMessage
                            id="chapterTitle"
                            values={{ chapterNo: getChapterNo(data) }}
                          />
                        </div>
                        {isItemLoaded(itemProps.index) ? (
                          renderItemSub ? (
                            renderItemSub(data)
                          ) : (
                            <ChapterSub chapter={data} />
                          )
                        ) : (
                          <Placeholder.Graph height={14} />
                        )}
                      </div>
                      {renderAction ? (
                        renderAction(data)
                      ) : (
                        <Icon icon="right" />
                      )}
                    </List.Item>
                  )
                );
              }}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
}
