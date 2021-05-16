import { InfiniteList, InfiniteListProps } from "../../components/InfiniteList";
import { useCallback } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { useHistory } from "react-router-dom";
import { Notification } from "rsuite";

export function StoryList(props: InfiniteListProps) {
  const history = useHistory();
  const handleClick = useCallback(
    (story: GetStoryDto) => {
      if (story.url) {
        history.push(`/story/${story.url}`, {
          story
        });
      } else {
        Notification.error({
          title: story.title,
          description: `Damn god, the story's url is missing. Please report this shitty issue to the admin.`,
          duration: 5000,
        });
      }
    },
    [history],
  );
  return <InfiniteList {...props} onItemClick={handleClick} />;
}
