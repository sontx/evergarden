import { useCreateChapter } from "../hooks/useCreateChapter";
import { useGoEditChapter } from "../../../hooks/navigation/useGoEditChapter";
import { useEffect } from "react";
import { ChapterEditor } from "../ChapterEditoir";
import { useStory } from "../../story/hooks/useStory";

export function CreateChapterEditor({ slug }: { slug: string }) {
  const { data: story, isLoading } = useStory(slug);
  const {
    data: chapter,
    isLoading: isSaving,
    mutate,
    isSuccess,
  } = useCreateChapter(story);
  const gotoEditChapter = useGoEditChapter();

  useEffect(() => {
    if (isSuccess && chapter) {
      gotoEditChapter(slug, chapter);
    }
  }, [chapter, gotoEditChapter, isSuccess, slug]);

  return (
    <ChapterEditor
      isSaving={isSaving}
      isFetching={isLoading}
      onCreate={(data) => {
        mutate(data);
      }}
    />
  );
}
