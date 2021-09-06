import { useStory } from "../../story/hooks/useStory";
import { ChapterEditor } from "../ChapterEditoir";
import { useUpdateChapter } from "../hooks/useUpdateChapter";
import { useChapter } from "../../chapter/hooks/useChapter";

export function UpdateChapterEditor({
  slug,
  chapterNo,
}: {
  slug: string;
  chapterNo: number;
}) {
  const { data: story, isLoading: isFetchingStory } = useStory(slug);
  const { data: editChapter, isLoading: isFetchingChapter } = useChapter(
    story?.id,
    chapterNo,
  );
  const { isLoading: isSaving, mutate } = useUpdateChapter(story);

  return (
    <ChapterEditor
      editChapter={editChapter}
      isSaving={isSaving}
      isFetching={isFetchingStory || isFetchingChapter}
      onUpdate={(chapterNo, data) => {
        mutate({ chapterNo, chapter: data });
      }}
    />
  );
}
