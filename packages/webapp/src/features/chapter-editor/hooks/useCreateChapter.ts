import api from "../../../utils/api";
import {
  CreateChapterDto,
  GetChapterDto,
  GetStoryDto,
} from "@evergarden/shared";
import { useEnhancedMutation } from "../../../hooks/api-query/useEnhancedMutation";
import { useQueryClient } from "react-query";

async function createChapter(
  storyId: number,
  chapter: CreateChapterDto,
): Promise<GetChapterDto> {
  const response = await api.post(`/api/stories/${storyId}/chapters`, chapter);
  return response.data;
}

export function useCreateChapter(story: GetStoryDto | undefined) {
  const queryClient = useQueryClient();
  return useEnhancedMutation<CreateChapterDto, GetChapterDto>(
    "create-chapter",
    (data) => createChapter(story?.id!, data),
    {
      onSuccess: async (data) => {
        queryClient.setQueryData(
          ["chapter", { storyId: data.storyId, chapterNo: data.chapterNo }],
          data,
        );
        await queryClient.invalidateQueries(["chapters", data.storyId]);

        const storyKey = ["story", story?.url];
        await queryClient.cancelQueries(storyKey);
        const currentStory = queryClient.getQueryData(storyKey) as GetStoryDto;
        if (currentStory) {
          queryClient.setQueryData<GetStoryDto>(storyKey, {
            ...currentStory,
            lastChapter:
              currentStory.lastChapter !== undefined
                ? currentStory.lastChapter++
                : 1,
          });
        }
      },
    },
  );
}
