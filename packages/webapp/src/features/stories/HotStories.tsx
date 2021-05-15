import {
  fetchHotStoriesAsync,
  selectStatus,
  selectStories,
  selectTotalItems,
} from "./hotStoriesSlice";
import { StoryItem } from "../../components/StoryItem";
import { InfiniteList } from "../../components/InfiniteList";

export function HotStories() {
  return (
    <InfiniteList
      renderItem={(item) => <StoryItem story={item} />}
      fetchFunc={fetchHotStoriesAsync}
      totalItemsSelector={selectTotalItems}
      itemsSelector={selectStories}
      statusSelector={selectStatus}
    />
  );
}
