import { StoryEditor } from "../StoryEditor";
import { useParams } from "react-router-dom";
import { useUpdateStory } from "../hooks/useUpdateStory";
import { useStory } from "../../story/hooks/useStory";

export function UpdateStoryEditor() {
  const { slug } = useParams<{ slug: string }>();
  const { isLoading: isFetching, data } = useStory(slug);
  const { isLoading: isSaving, mutate } = useUpdateStory(slug);

  return (
    <StoryEditor
      isSaving={isSaving}
      isFetching={isFetching}
      editStory={data}
      onUpdate={(updateData) => {
        mutate(updateData);
      }}
    />
  );
}

