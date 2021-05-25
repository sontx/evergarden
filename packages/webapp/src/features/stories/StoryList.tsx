import { InfiniteList, InfiniteListProps } from "../../components/InfiniteList";
import { useCallback } from "react";
import { GetStoryDto } from "@evergarden/shared";
import { Notification } from "rsuite";
import { useAppDispatch } from "../../app/hooks";
import {openStory} from "../story/storySlice";
import {useHistory} from "react-router-dom";

export function StoryList(props: InfiniteListProps) {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleClick = useCallback(
    (story: GetStoryDto) => {
      if (story.url) {
        dispatch(openStory(history, story));
      } else {
        Notification.error({
          title: story.title,
          description: `Damn god, the story's url is missing. Please report this shitty issue to the admin.`,
          duration: 5000,
        });
      }
    },
    [dispatch, history],
  );
  return <InfiniteList {...props} onItemClick={handleClick} />;
}
