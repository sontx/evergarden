import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { Animation, List } from "rsuite";
import InfiniteLoader from "react-window-infinite-loader";
import {
  selectCategory,
  selectStories,
  selectTotalItems,
  setStories,
  setTotalItems,
} from "./storiesSlice";
import { selectLimitCountPerPage } from "../settings/settingsSlice";
import { StoryItem } from "../../components/StoryItem";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { fetchStories } from "./storiesAPI";
import { openStory } from "../story/storySlice";

import "./storyList.less";

function Loading() {
  return (
    <div className="rs-placeholder rs-placeholder-paragraph">
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
let SHOW_STORIES: GetStoryDto[] = [];

export function StoryList() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const infiniteLoaderRef = useRef<InfiniteLoader | null>(null);
  const stories = useAppSelector(selectStories);
  const totalItems = useAppSelector(selectTotalItems) || 10;
  const limitCountPerPage = useAppSelector(selectLimitCountPerPage);
  const category = useAppSelector(selectCategory);

  const fetchMore = async (
    startIndex: number,
    stopIndex: number,
  ): Promise<any> => {
    const result = await fetchStories(
      startIndex,
      stopIndex - startIndex + 1,
      category,
    );
    const items = result.items;
    const actualStopIndex = Math.min(stopIndex, items.length + startIndex - 1);
    for (let i = startIndex; i <= actualStopIndex; i++) {
      SHOW_STORIES[i] = items[i - startIndex];
    }

    if (totalItems !== result.meta.totalItems) {
      dispatch(setTotalItems(result.meta.totalItems));
    }
  };

  useEffect(() => {
    SHOW_STORIES = [...stories];
    if (infiniteLoaderRef.current) {
      infiniteLoaderRef.current.resetloadMoreItemsCache();
    }
    return () => {
      const firstSequenceStories = [];
      for (const story of SHOW_STORIES) {
        if (story) {
          firstSequenceStories.push(story);
        } else {
          break;
        }
      }
      dispatch(setStories(firstSequenceStories));
    };
  }, [dispatch, stories]);

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
            isItemLoaded={(index) => !!SHOW_STORIES[index]}
            loadMoreItems={fetchMore}
            minimumBatchSize={limitCountPerPage}
            itemCount={totalItems}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                height={height}
                itemCount={totalItems}
                itemSize={ITEM_HEIGHT}
                onItemsRendered={onItemsRendered}
                direction="vertical"
                ref={ref}
                width={width}
                innerElementType={(listProps) => <List {...listProps} hover />}
              >
                {(itemProps: ListChildComponentProps<GetStoryDto[]>) => {
                  const data = SHOW_STORIES[itemProps.index];
                  return (
                    <List.Item
                      className="story-list-item--loading"
                      key={itemProps.index}
                      style={itemProps.style}
                      onClick={() => handleClick(data)}
                    >
                      {data ? (
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