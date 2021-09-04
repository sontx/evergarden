import { useCreateStory } from "../hooks/useCreateStory";
import { StoryEditor } from "../../../components/StoryEditor";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export function CreateStoryEditor() {
  const { isLoading: isSaving, mutate, data, isSuccess } = useCreateStory();
  const history = useHistory();

  useEffect(() => {
    if (isSuccess && data) {
      history.push(`/user/story/${data.url}`);
    }
  }, [isSuccess, data, history]);

  return (
    <StoryEditor
      isSaving={isSaving}
      onCreate={(createData) => {
        mutate(createData);
      }}
    />
  );
}
