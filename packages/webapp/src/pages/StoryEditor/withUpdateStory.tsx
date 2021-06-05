import { ElementType, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchUserStoryAsync,
  selectStory,
} from "../../features/story-editor/storyEditorSlice";
import { useParams } from "react-router-dom";

export function withUpdateStory(Component: ElementType) {
  return (props: any) => {
    const dispatch = useAppDispatch();
    const story = useAppSelector(selectStory);
    const { url } = useParams<{ url: string }>();

    useEffect(() => {
      if ((!story || story.url !== url) && url) {
        dispatch(fetchUserStoryAsync(url));
      }
    }, [dispatch, story, url]);

    return <Component {...props} />;
  };
}
