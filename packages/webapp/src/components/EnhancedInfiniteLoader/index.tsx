import { CSSProperties, memo, ReactElement } from "react";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { List } from "rsuite";

const Item = memo(({ index, data, style }: ListChildComponentProps) => {
  const { items, isItemLoaded, renderLoader, renderItem } = data;
  return !isItemLoaded(index)
    ? renderLoader(style)
    : renderItem(index, items[index], style);
});

export function EnhancedInfiniteLoader({
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  items,
  renderLoader,
  renderItem,
  itemHeight,
}: {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  items: any[];
  itemHeight: number;
  loadNextPage: (start: number, stop: number) => Promise<void> | null;
  renderLoader: (style: CSSProperties) => ReactElement;
  renderItem: (index: number, data: any, style: CSSProperties) => ReactElement;
}) {
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = isNextPageLoading
    ? (_: number, __: number) => null
    : loadNextPage;
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              className="List"
              height={height}
              itemCount={itemCount}
              itemSize={itemHeight}
              onItemsRendered={onItemsRendered}
              ref={ref}
              width={width}
              itemData={{
                items,
                isItemLoaded,
                renderLoader,
                renderItem,
              }}
              innerElementType={List}
            >
              {Item}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
}
