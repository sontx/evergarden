import { StandardProps } from "rsuite/es/@types/common";
import {
  HorizontalStoryItem,
  HorizontalStoryItemSkeleton,
} from "../../../components/StoryItem";
import { withAnimation } from "../../../components/StoryItem/withAnimation";
import { withStoriesFilter } from "../../../HOCs/withStoriesFilter";
import { StoryList } from "../../../components/StoryList";
import { useUserStories } from "../hooks/useUserStories";
import { useCallback } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { useHistory } from "react-router-dom";

const StoryItem = withAnimation(HorizontalStoryItem);
const FilterStories = withStoriesFilter(StoryList);

export function UserStories(props: StandardProps) {
  const { data } = useUserStories();
  const history = useHistory();

  const handleClick = useCallback((story: GetStoryDto) => {
    history.push(`/user/story/${story.url}`);
  }, [history])

  return (
    <FilterStories
      {...props}
      layout="vertical"
      stories={data}
      skeletonCount={5}
      renderSkeleton={() => <HorizontalStoryItemSkeleton />}
      renderItem={(story) => <StoryItem story={story} onClick={handleClick}/>}
    />
  );
}
