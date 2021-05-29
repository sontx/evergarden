import {
  fetchLastUpdatedStoriesAsync,
  selectStatus,
  selectStories,
  selectTotalItems,
} from "./lastUpdatedStoriesSlice";
import { StoryItem } from "../../components/StoryItem";
import {withStoryList} from "./withStoryList";
import {InfiniteList} from "../../components/InfiniteList";

const StoryList = withStoryList(InfiniteList);

export function LastUpdatedStories() {
  return (
    <StoryList
      renderItem={(item: any) => <StoryItem story={item} />}
      fetchFunc={fetchLastUpdatedStoriesAsync}
      totalItemsSelector={selectTotalItems}
      itemsSelector={selectStories}
      statusSelector={selectStatus}
    />
  );
}
