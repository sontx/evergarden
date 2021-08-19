import api from "../../utils/api";
import {
  GetReadingHistoryDto,
  UpdateReadingHistoryDto,
} from "@evergarden/shared";

export async function updateStoryHistory(history: UpdateReadingHistoryDto) {
  const blob = new Blob([JSON.stringify(history)], {
    type: "application/json",
  });
  navigator.sendBeacon("/api/histories", blob);
}

export async function fetchReadingHistories(): Promise<GetReadingHistoryDto[]> {
  const response = await api.get("/api/histories");
  return response.data;
}
