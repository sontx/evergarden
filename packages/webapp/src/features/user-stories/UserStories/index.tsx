import { StandardProps } from "rsuite/es/@types/common";
import {
  HorizontalStoryItem,
  HorizontalStoryItemSkeleton,
} from "../../../components/StoryItem";
import { withAnimation } from "../../../components/StoryItem/withAnimation";
import { withStoriesFilter } from "../../../components/UserStoryListPage/withStoriesFilter";
import { StoryList } from "../../../components/StoryList";
import { useUserStories } from "../hooks/useUserStories";
import { useGoEditStory } from "../../../hooks/navigation/useGoEditStory";

const StoryItem = withAnimation(HorizontalStoryItem);
const FilterStories = withStoriesFilter(StoryList);

export function UserStories(props: StandardProps) {
  const { data } = useUserStories();
  const gotoEditStory = useGoEditStory();

  return (
    <FilterStories
      {...props}
      layout="vertical"
      stories={data}
      skeletonCount={5}
      renderSkeleton={() => <HorizontalStoryItemSkeleton />}
      renderItem={(story) => (
        <StoryItem story={story} onClick={gotoEditStory} />
      )}
    />
  );
}
