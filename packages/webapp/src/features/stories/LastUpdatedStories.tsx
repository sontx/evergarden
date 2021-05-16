import {
  fetchLastUpdatedStoriesAsync,
  selectStatus,
  selectStories,
  selectTotalItems,
} from "./lastUpdatedStoriesSlice";
import { StoryItem } from "../../components/StoryItem";
import { StoryList } from "./StoryList";

export function LastUpdatedStories() {
  return (
    <StoryList
      renderItem={(item) => <StoryItem story={item} />}
      fetchFunc={fetchLastUpdatedStoriesAsync}
      totalItemsSelector={selectTotalItems}
      itemsSelector={selectStories}
      statusSelector={selectStatus}
    />
  );
}
