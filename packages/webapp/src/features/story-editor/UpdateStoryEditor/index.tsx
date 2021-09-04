import { StoryEditor } from "../../../components/StoryEditor";
import { useParams } from "react-router-dom";
import { useUpdateStory } from "../hooks/useUpdateStory";
import { useStory } from "../hooks/useStory";

export function UpdateStoryEditor() {
  const { url } = useParams<{ url: string }>();
  const { isLoading: isFetching, data } = useStory(url);
  const { isLoading: isSaving, mutate } = useUpdateStory(url);

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
