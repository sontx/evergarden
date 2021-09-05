import { useCreateStory } from "../hooks/useCreateStory";
import { StoryEditor } from "../../../components/StoryEditor";
import { useEffect } from "react";
import { useGoEditStory } from "../../../hooks/navigation/useGoEditStory";

export function CreateStoryEditor() {
  const { isLoading: isSaving, mutate, data, isSuccess } = useCreateStory();
  const gotoEditStory = useGoEditStory();

  useEffect(() => {
    if (isSuccess && data) {
      gotoEditStory(data);
    }
  }, [isSuccess, data, gotoEditStory]);

  return (
    <StoryEditor
      isSaving={isSaving}
      onCreate={(createData) => {
        mutate(createData);
      }}
    />
  );
}
