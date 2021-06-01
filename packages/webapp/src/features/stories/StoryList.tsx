import { useAppDispatch } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetStoryDto, StoryCategory } from "@evergarden/shared";
import { Animation, List } from "rsuite";
import InfiniteLoader from "react-window-infinite-loader";
import { StoryItem } from "../../components/StoryItem";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { fetchStories } from "./storiesAPI";
import { openStory } from "../story/storySlice";

import "./storyList.less";

function Loading() {
  return (
    <div className="story-list-item--loading rs-placeholder rs-placeholder-paragraph">
      <div className="rs-placeholder-paragraph-graph rs-placeholder-paragraph-graph-square">
        <span className="rs-placeholder-paragraph-graph-inner" />
      </div>
      <div className="rs-placeholder-paragraph-rows">
        <p style={{ width: "64.4229%", height: "10px", marginTop: "5px" }} />
        <p style={{ width: "47.1585%", height: "10px", marginTop: "10px" }} />
      </div>
    </div>
  );
}

const ITEM_HEIGHT = 66;
let SHOW_STORIES: (GetStoryDto | false | undefined)[] = [];

const isItemLoaded = (index: number) => SHOW_STORIES[index] !== undefined;

export function StoryList({ category }: { category: StoryCategory }) {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const infiniteLoaderRef = useRef<InfiniteLoader | null>(null);
  const [totalItems, setTotalItems] = useState(100);

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
        dispatch(openStory(history, story));
      }
    },
    [dispatch, history],
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
                innerElementType={(listProps) => <List {...listProps} hover />}
              >
                {(itemProps: ListChildComponentProps<GetStoryDto[]>) => {
                  const data = SHOW_STORIES[itemProps.index] as any;
                  return (
                    <List.Item
                      key={itemProps.index}
                      style={itemProps.style}
                      onClick={() => handleClick(data)}
                    >
                      {isItemLoaded(itemProps.index) ? (
                        <Animation.Bounce in={true}>
                          {(animationProps, ref) => (
                            <div {...animationProps} ref={ref}>
                              <StoryItem story={data} />
                            </div>
                          )}
                        </Animation.Bounce>
                      ) : (
                        <Loading />
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
