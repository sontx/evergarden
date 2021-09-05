import api from "../../../utils/api";
import { CreateStoryDto, GetStoryDto } from "@evergarden/shared";
import { useListMutation } from "../../../hooks/api-query/useListMutation";
import { CreateStoryData } from "../../../components/StoryEditor";
import { updateStoryCover } from "../storyEditorAPI";
import { useCacheStory } from "../../story/hooks/useCacheStory";

async function createStory(story: CreateStoryDto): Promise<GetStoryDto> {
  const response = await api.post("/api/stories", story);
  return response.data;
}

export function useCreateStory() {
  const cacheStory = useCacheStory();
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
        cacheStory(data);
      },
    },
  );
}
