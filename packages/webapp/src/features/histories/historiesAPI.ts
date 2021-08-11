import api from "../../utils/api";
import {
  GetReadingHistoryDto,
  UpdateReadingHistoryDto,
} from "@evergarden/shared";

export async function updateStoryHistory(history: UpdateReadingHistoryDto) {
  await api.put("/api/histories", history);
}

export async function fetchReadingHistories(): Promise<GetReadingHistoryDto[]> {
  const response = await api.get("/api/histories");
  return response.data;
}
