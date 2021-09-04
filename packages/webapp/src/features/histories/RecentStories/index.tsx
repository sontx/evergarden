import { StandardProps } from "rsuite/es/@types/common";
import {
  CompactStoryItem,
  CompactStoryItemSkeleton,
} from "../../../components/StoryItem";
import { withAnimation } from "../../../components/StoryItem/withAnimation";
import { withHistory } from "../../../components/StoryItem/withHistory";
import { withStoriesFilter } from "../../../HOCs/withStoriesFilter";
import { StoryList } from "../../../components/StoryList";
import { useReadingHistory } from "../hooks/useReadingHistory";
import { useRecent } from "../hooks/useRecent";

const StoryItem = withHistory(withAnimation(CompactStoryItem));
const FilterStories = withStoriesFilter(StoryList);

export function RecentStories(props: StandardProps) {
  const { data: readingHistory } = useReadingHistory();
  const { data: stories } = useRecent();

  return (
    <FilterStories
      {...props}
      layout="vertical"
      stories={stories}
      skeletonCount={readingHistory ? readingHistory.length : 5}
      renderSkeleton={() => <CompactStoryItemSkeleton />}
      renderItem={(story) => <StoryItem story={story} />}
    />
  );
}
