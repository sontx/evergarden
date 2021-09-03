import { StandardProps } from "rsuite/es/@types/common";
import {
  CompactStoryItem,
  CompactStoryItemSkeleton,
} from "../../../components/StoryItem";
import { withAnimation } from "../../../components/StoryItem/withAnimation";
import { withHistory } from "../../../components/StoryItem/withHistory";
import { useFollowingStories } from "../hooks/useFollowingStories";
import { Alert, Icon, IconButton } from "rsuite";
import { useUnfollowStory } from "../hooks/useUnfollowStory";
import { useFollowingStoryCount } from "../hooks/useFollowingStoryCount";
import { withStoriesFilter } from "../../../HOCs/withStoriesFilter";
import { StoryList } from "../../../components/StoryList";
import { useIntl } from "react-intl";

const StoryItem = withHistory(withAnimation(CompactStoryItem));
const FilterStories = withStoriesFilter(StoryList);

export function FollowingStories(props: StandardProps) {
  const { data } = useFollowingStories();
  const { mutate } = useUnfollowStory();
  const followingCount = useFollowingStoryCount(5);
  const intl = useIntl();

  return (
    <FilterStories
      {...props}
      layout="vertical"
      stories={data}
      skeletonCount={followingCount}
      renderSkeleton={() => <CompactStoryItemSkeleton />}
      renderItem={(story) => (
        <StoryItem
          story={story}
          rightSlot={() => (
            <IconButton
              color="red"
              size="xs"
              appearance="ghost"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                mutate(story);
                Alert.success(
                  <div>
                    {intl.formatMessage({ id: "unfollowSuccess" })}{" "}
                    <span style={{ fontWeight: 500 }}>{story.title}</span>
                  </div>,
                );
              }}
              icon={<Icon icon="trash" />}
            />
          )}
        />
      )}
    />
  );
}
