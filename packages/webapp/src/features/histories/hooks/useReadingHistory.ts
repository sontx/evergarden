import api from "../../../utils/api";
import { GetReadingHistoryDto } from "@evergarden/shared";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import ms from "ms";

async function fetchReadingHistories(): Promise<GetReadingHistoryDto[]> {
  const response = await api.get("/api/histories");
  return response.data;
}

export function useReadingHistory() {
  return useSimpleQuery("reading-history", () => fetchReadingHistories(), {
    staleTime: ms("2h"),
    cacheTime: ms("12h"),
  });
}
