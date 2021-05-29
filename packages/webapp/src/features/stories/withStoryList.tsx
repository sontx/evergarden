import { ElementType, useCallback } from "react";
import { useAppDispatch } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { GetStoryDto } from "@evergarden/shared";
import { openStory } from "../story/storySlice";
import { Notification } from "rsuite";

export function withStoryList(Component: ElementType) {
  return (props: any) => {
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
    return <Component {...props} onItemClick={handleClick} />;
  };
}
