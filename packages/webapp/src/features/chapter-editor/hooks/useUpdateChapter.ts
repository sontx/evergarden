import api from "../../../utils/api";
import {
  GetChapterDto,
  GetStoryDto,
  UpdateChapterDto,
} from "@evergarden/shared";
import { useEnhancedMutation } from "../../../hooks/api-query/useEnhancedMutation";
import { useQueryClient } from "react-query";

async function updateChapter(
  storyId: number,
  chapterNo: number,
  chapter: UpdateChapterDto,
): Promise<GetChapterDto> {
  const response = await api.put(
    `/api/stories/${storyId}/chapters/${chapterNo}`,
    chapter,
  );
  return response.data;
}

export function useUpdateChapter(story: GetStoryDto | undefined) {
  const queryClient = useQueryClient();
  return useEnhancedMutation<
    { chapterNo: number; chapter: UpdateChapterDto },
    GetChapterDto
  >(
    "update-chapter",
    (data) => updateChapter(story?.id!, data.chapterNo, data.chapter),
    {
      onSuccess: async (data) => {
        queryClient.setQueryData(
          ["chapter", { storyId: data.storyId, chapterNo: data.chapterNo }],
          data,
        );
        await queryClient.invalidateQueries(["chapters", data.storyId]);
      },
    },
  );
}
