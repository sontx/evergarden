import api from "../../../utils/api";
import { GetStoryDto, UpdateStoryDto } from "@evergarden/shared";
import { useListObjectMutation } from "../../../hooks/useListObjectMutation";
import { UpdateStoryData } from "../../../components/StoryEditor";
import { deleteStoryCover, updateStoryCover } from "../storyEditorAPI";

async function updateStory(
  id: number,
  story: UpdateStoryDto,
): Promise<GetStoryDto> {
  const response = await api.put(`/api/stories/${id}`, story);
  return response.data;
}

export function useUpdateStory(slug: string) {
  return useListObjectMutation<UpdateStoryData, GetStoryDto>(
    "update-story",
    async (data) => {
      const { id, cover, ...rest } = data;
      const updatedStory = await updateStory(id, rest);
      if (cover) {
        return await updateStoryCover(id, cover);
      } else if (cover === null) {
        return await deleteStoryCover(id);
      }
      return updatedStory;
    },
    {
      relativeQueryKey: "user-stories",
      updateQueryFrom: "response",
      objectUpdateQueryDataFn: (prev, next) => next,
      objectQueryKey: ["story", slug],
      objectUpdateQueryFrom: "response",
    },
  );
}
