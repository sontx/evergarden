import { ElementType, SyntheticEvent, useCallback, useRef } from "react";
import { withAction } from "../../components/StoryItemEx/withAction";
import { withAnimation } from "../../components/StoryItemEx/withAnimation";
import { Icon } from "rsuite";
import { updateStoryHistoryAsync } from "../history/historySlice";
import { useAppDispatch } from "../../app/hooks";
import { removeStory } from "./followingSlice";

import "./withDeleteAction.less";

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
            history: {
              storyId: story.id,
              isFollowing: false,
            },
            startReading: false,
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
