import { useCallback, useEffect, useRef, useState } from "react";
import { GetStoryDto, StoryCategory } from "@evergarden/shared";
import { Animation, List } from "rsuite";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { fetchStories } from "./storiesAPI";

import "./storyList.less";
import { abbreviateNumber } from "../../utils/types";
import { StoryItemLoading } from "../../components/StoryItemLoading";
import { withAnimation } from "../../components/StoryItem/withAnimation";
import { CompactStoryItem } from "../../components/StoryItem";
import { useGoStory } from "../../hooks/navigation/useGoStory";

const StoryItemWrapper = withAnimation(CompactStoryItem);

function ViewCountSub({ story }: { story: GetStoryDto }) {
  return <span>{abbreviateNumber(story.view)} views</span>;
}

const ITEM_HEIGHT = 66;
let SHOW_STORIES: (GetStoryDto | false | undefined)[] = [];

const isItemLoaded = (index: number) => SHOW_STORIES[index] !== undefined;

export function StoryList({ category }: { category: StoryCategory }) {
  const infiniteLoaderRef = useRef<InfiniteLoader | null>(null);
  const [totalItems, setTotalItems] = useState(100);
  const gotoStory = useGoStory();

  const fetchMore = async (
    startIndex: number,
    stopIndex: number,
  ): Promise<any> => {
    for (let i = startIndex; i <= stopIndex; i++) {
      SHOW_STORIES[i] = false;
    }

    const result = await fetchStories(
      startIndex,
      stopIndex - startIndex + 1,
      category,
    );

    const items = result.items;
    for (let i = startIndex; i <= stopIndex; i++) {
      SHOW_STORIES[i] = items[i - startIndex];
    }

    if (totalItems !== result.meta.totalItems) {
      setTotalItems(result.meta.totalItems);
    }
  };

  useEffect(() => {
    SHOW_STORIES = [];
    if (infiniteLoaderRef.current) {
      infiniteLoaderRef.current.resetloadMoreItemsCache();
    }
  }, [category]);

  const handleClick = useCallback(
    (story: GetStoryDto) => {
      if (story) {
        gotoStory(story);
      }
    },
    [gotoStory],
  );

  return (
    <div style={{ flex: "1" }}>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <InfiniteLoader
            ref={infiniteLoaderRef}
            isItemLoaded={isItemLoaded}
            loadMoreItems={fetchMore}
            minimumBatchSize={10}
            itemCount={totalItems}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                height={height}
                itemCount={totalItems}
                itemSize={ITEM_HEIGHT}
                onItemsRendered={onItemsRendered}
                layout="vertical"
                ref={ref}
                width={width}
                innerElementType={(listProps) => <List {...listProps} />}
              >
                {(itemProps: ListChildComponentProps<GetStoryDto[]>) => {
                  const data = SHOW_STORIES[itemProps.index] as any;
                  return (
                    <List.Item key={itemProps.index} style={itemProps.style}>
                      {isItemLoaded(itemProps.index) && data !== false ? (
                        <Animation.Bounce in={true}>
                          {(animationProps, ref) => (
                            <div {...animationProps} ref={ref}>
                              <StoryItemWrapper
                                story={data}
                                mainNoWrap
                                onClick={handleClick}
                                RightSub={ViewCountSub}
                              />
                            </div>
                          )}
                        </Animation.Bounce>
                      ) : (
                        <StoryItemLoading />
                      )}
                    </List.Item>
                  );
                }}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
}
