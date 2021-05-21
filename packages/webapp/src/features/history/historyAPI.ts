import {
  GetStoryHistoryDto,
  IdType,
  UpdateStoryHistoryDto
} from "@evergarden/shared";
import api from "../../utils/api";

export async function updateStoryHistory(
  historyId: IdType | undefined,
  history: UpdateStoryHistoryDto,
) {
  await api.put("/api/histories", history, {
    params: {
      historyId: historyId || "",
    },
  });
}

export async function fetchStoryHistory(historyId: IdType, storyId: IdType): Promise<GetStoryHistoryDto> {
  const response = await api.get(`/api/histories/${historyId}/${storyId}`);
  return response.data;
}
