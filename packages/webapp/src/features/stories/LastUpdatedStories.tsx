import {
  fetchLastUpdatedStoriesAsync,
  selectStatus,
  selectStories,
  selectTotalItems,
} from "./lastUpdatedStoriesSlice";
import { StoryItem } from "../../components/StoryItem";
import { InfiniteList } from "../../components/InfiniteList";

export function LastUpdatedStories() {
  return (
    <InfiniteList
      renderItem={(item) => <StoryItem story={item} />}
      fetchFunc={fetchLastUpdatedStoriesAsync}
      totalItemsSelector={selectTotalItems}
      itemsSelector={selectStories}
      statusSelector={selectStatus}
    />
  );
}
