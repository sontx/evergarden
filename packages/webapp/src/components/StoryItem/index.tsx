import { FlexboxGrid, Icon, IconButton } from "rsuite";
import { GetStoryDto } from "@evergarden/shared";
import moment from "moment";

import "./index.less";

export interface StoryItemProps {
  story: GetStoryDto & { isFollowing?: boolean };
}

export function StoryItemMobile(props: StoryItemProps) {
  const { story } = props;
  return (
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={16}>
        <div>{story.title}</div>
        {story.updated !== undefined && <span className="story-item-sub">{moment(story.updated).fromNow()}</span>}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item className="story-item-action" colspan={8}>
        <IconButton
          appearance={story.isFollowing ? "default" : "subtle"}
          size="sm"
          icon={<Icon icon="arrow-right" />}
          placement="right"
        >
          Chapter {story.lastChapter || 0}
        </IconButton>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}

export function StoryItem(props: StoryItemProps) {
  return <StoryItemMobile {...props} />;
}
