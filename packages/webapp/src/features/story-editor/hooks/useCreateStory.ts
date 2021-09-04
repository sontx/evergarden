import api from "../../../utils/api";
import { CreateStoryDto, GetStoryDto } from "@evergarden/shared";
import { useListMutation } from "../../../hooks/useListMutation";
import { CreateStoryData } from "../../../components/StoryEditor";
import { updateStoryCover } from "../storyEditorAPI";
import { useQueryClient } from "react-query";

async function createStory(story: CreateStoryDto): Promise<GetStoryDto> {
  const response = await api.post("/api/stories", story);
  return response.data;
}

export function useCreateStory() {
  const queryClient = useQueryClient();
  return useListMutation<CreateStoryData, GetStoryDto>(
    "create-story",
    async (data) => {
      const { cover, ...rest } = data;
      const newStory = await createStory(rest);
      if (cover) {
        return await updateStoryCover(newStory.id, cover);
      }
      return newStory;
    },
    {
      relativeQueryKey: "user-stories",
      updateQueryFrom: "response",
      onSuccess: (data) => {
        queryClient.setQueryData(["story", data.url], data);
      },
    },
  );
}
