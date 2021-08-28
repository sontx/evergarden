import { ElementType, SyntheticEvent, useCallback, useRef } from "react";
import { Icon } from "rsuite";
import { useAppDispatch } from "../../app/hooks";
import { removeStory } from "./followingSlice";

import "./withDeleteAction.less";
import { updateStoryHistoryAsync } from "../histories/historiesSlice";
import { withAnimation } from "../../components/StoryItem/withAnimation";
import { withAction } from "../../components/StoryItem/withAction";

export function withDeleteAction(Component: ElementType) {
  const Wrapper = withAnimation(withAction(Component));

  return ({ story, ...rest }: any) => {
    const dispatch = useAppDispatch();
    const showHandlerRef = useRef<((show: boolean) => void) | undefined>(
      undefined,
    );

    const handleDelete = useCallback(
      (event: SyntheticEvent) => {
        event.stopPropagation();
        event.preventDefault();
        if (showHandlerRef.current) {
          showHandlerRef.current(false);
        }
        dispatch(
          updateStoryHistoryAsync({
            storyId: story.id,
            isFollowing: false,
          }),
        );
      },
      [dispatch, story],
    );

    const handleExitedAnimation = useCallback(() => {
      dispatch(removeStory(story));
    }, [dispatch, story]);

    const showHandler = useCallback((handler) => {
      showHandlerRef.current = handler;
    }, []);

    return (
      <Wrapper
        {...rest}
        story={story}
        action={
          <div className="with-delete-action">
            <Icon icon="trash" />
          </div>
        }
        onActionClick={handleDelete}
        onExitedAnimation={handleExitedAnimation}
        showHandler={showHandler}
      />
    );
  };
}
