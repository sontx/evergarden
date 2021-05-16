import {
  fetchHotStoriesAsync,
  selectStatus,
  selectStories,
  selectTotalItems,
} from "./hotStoriesSlice";
import { StoryItem } from "../../components/StoryItem";
import { StoryList } from "./StoryList";

export function HotStories() {
  return (
    <StoryList
      renderItem={(item) => <StoryItem story={item} />}
      fetchFunc={fetchHotStoriesAsync}
      totalItemsSelector={selectTotalItems}
      itemsSelector={selectStories}
      statusSelector={selectStatus}
    />
  );
}
