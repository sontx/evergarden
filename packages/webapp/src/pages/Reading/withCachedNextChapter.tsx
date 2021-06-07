import { ElementType, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchNextChapterAsync } from "../../features/chapter/chapterSlice";

export function withCachedNextChapter(Component: ElementType) {
  return ({ story, chapter, ...rest }: any) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (story && chapter && story.lastChapter > chapter.chapterNo) {
        dispatch(
          fetchNextChapterAsync({
            storyId: story.id,
            chapterNo: chapter.chapterNo + 1,
          }),
        );
      }
    }, [chapter, dispatch, story]);

    return <Component {...rest} story={story} chapter={chapter} />;
  };
}
