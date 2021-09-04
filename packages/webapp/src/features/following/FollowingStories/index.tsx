import { StandardProps } from "rsuite/es/@types/common";
import {
  CompactStoryItem,
  CompactStoryItemSkeleton,
} from "../../../components/StoryItem";
import { withAnimation } from "../../../components/StoryItem/withAnimation";
import { withHistory } from "../../../components/StoryItem/withHistory";
import { useFollowingStories } from "../hooks/useFollowingStories";
import { Alert, Divider, Icon, IconButton } from "rsuite";
import { useUnfollowStory } from "../hooks/useUnfollowStory";
import { useFollowingStoryCount } from "../hooks/useFollowingStoryCount";
import { withStoriesFilter } from "../../../HOCs/withStoriesFilter";
import { StoryList } from "../../../components/StoryList";
import { FormattedMessage, useIntl } from "react-intl";
import { ChapterNumber } from "../../../components/StoryItem/CompactStoryItem/ChapterNumber";
import { useStoriesHistory } from "../../histories/hooks/useStoriesHistory";

const StoryItem = withHistory(withAnimation(CompactStoryItem));
const FilterStories = withStoriesFilter(StoryList);

export function FollowingStories(props: StandardProps) {
  const { data } = useFollowingStories();
  const { mutate } = useUnfollowStory();
  const followingCount = useFollowingStoryCount(5);
  const stories = useStoriesHistory(data);
  const intl = useIntl();

  return (
    <FilterStories
      {...props}
      layout="vertical"
      stories={stories}
      skeletonCount={followingCount}
      renderSkeleton={() => <CompactStoryItemSkeleton />}
      renderItem={(story) => (
        <StoryItem
          story={story}
          subtitle={() => (
            <>
              <ChapterNumber story={story} />
              {story.history && (
                <>
                  <Divider vertical />
                  <FormattedMessage
                    id="continueReadingText"
                    values={{ chapter: story.history.currentChapterNo }}
                  />
                </>
              )}
            </>
          )}
          rightSlot={() => (
            <IconButton
              color="red"
              size="xs"
              appearance="ghost"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                mutate(story.id);
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
