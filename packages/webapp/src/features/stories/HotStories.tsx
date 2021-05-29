import {
  fetchHotStoriesAsync,
  selectStatus,
  selectStories,
  selectTotalItems,
} from "./hotStoriesSlice";
import { StoryItem } from "../../components/StoryItem";
import {withStoryList} from "./withStoryList";
import {InfiniteList} from "../../components/InfiniteList";

const StoryList = withStoryList(InfiniteList);

export function HotStories() {
  return (
    <StoryList
      renderItem={(item: any) => <StoryItem story={item} />}
      fetchFunc={fetchHotStoriesAsync}
      totalItemsSelector={selectTotalItems}
      itemsSelector={selectStories}
      statusSelector={selectStatus}
    />
  );
}
