import { ElementType, useEffect } from "react";
import { updateStoryHistoryAsync } from "../../features/history/historySlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory } from "../../features/story/storySlice";

export function withViewCountSync(Component: ElementType) {
  return (props: any) => {
    const dispatch = useAppDispatch();
    const story = useAppSelector(selectStory);

    // update story's view count, after 5s if the user is still reading in this page we'll count it as a view
    useEffect(() => {
      if (story) {
        const timeoutId = window.setTimeout(() => {
          dispatch(
            updateStoryHistoryAsync({
              history: {
                storyId: story.id,
              },
              startReading: true,
            }),
          );
        }, 5000);
        return () => window.clearTimeout(timeoutId);
      }
    }, [dispatch, story]);

    return <Component {...props} />;
  };
}
