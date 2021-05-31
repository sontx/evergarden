import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { openStory } from "../story/storySlice";
import { Animation, List, Loader, Notification } from "rsuite";
import {
  fetchStoriesAsync,
  selectCategory,
  selectStatus,
  selectStories,
  selectTotalItems,
} from "./storiesSlice";
import { selectLimitCountPerPage } from "../settings/settingsSlice";
import InfiniteScroll from "react-infinite-scroller";
import { StoryItem } from "../../components/StoryItem";

export function StoryList() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const items = useAppSelector(selectStories);
  const totalItems = useAppSelector(selectTotalItems);
  const limitCountPerPage = useAppSelector(selectLimitCountPerPage);
  const status = useAppSelector(selectStatus);
  const category = useAppSelector(selectCategory);

  // Workaround: InfiniteScroll won't start fetching data if the cached items in the list is big
  const [isStartLoading, setStartLoading] = useState(false);
  const [isMounted, setMounted] = useState(false);
  const [pageOffset, setPageOffset] = useState(1);

  const fetchMore = useCallback(
    (page: number) => {
      setStartLoading(true);
      dispatch(
        fetchStoriesAsync({
          page: page - pageOffset,
          limit: limitCountPerPage,
          category: category,
        }),
      );
    },
    [category, dispatch, limitCountPerPage, pageOffset],
  );

  useEffect(() => {
    if (isMounted) {
      if (!isStartLoading) {
        setPageOffset(0);
        fetchMore(1);
      }
    }
    setMounted(true);
  }, [fetchMore, isMounted, isStartLoading]);

  const handleItemClick = useCallback(
    (story: GetStoryDto) => {
      if (story.url) {
        dispatch(openStory(history, story));
      } else {
        Notification.error({
          title: story.title,
          description: `Damn god, the story's url is missing. Please report this shitty issue to the admin.`,
          duration: 5000,
        });
      }
    },
    [dispatch, history],
  );

  return (
    <Animation.Slide in={true}>
      {(animationProps, ref) => (
        <div
          style={{ display: "flex", flexDirection: "column" }}
          {...animationProps}
          ref={ref}
        >
          <List hover>
            <InfiniteScroll
              loadMore={fetchMore}
              hasMore={
                status === "none" ||
                (items.length < totalItems && status !== "processing")
              }
            >
              {items.map((story) => (
                <List.Item
                  key={story.id}
                  onClick={() => handleItemClick(story)}
                >
                  <StoryItem story={story} />
                </List.Item>
              ))}
            </InfiniteScroll>
          </List>
          {status === "processing" && (
            <div
              style={{ height: "40px", position: "relative", marginTop: "8px" }}
            >
              <Loader center />
            </div>
          )}
        </div>
      )}
    </Animation.Slide>
  );
}
