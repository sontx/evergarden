import api from "../../../utils/api";
import { GetReadingHistoryDto } from "@evergarden/shared";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import ms from "ms";
import { useIsLoggedIn } from "../../user/hooks/useIsLoggedIn";
import { LocalReadingHistory } from "../local-reading-history";

async function fetchReadingHistories(): Promise<GetReadingHistoryDto[]> {
  const response = await api.get("/api/histories");
  return response.data;
}

export function useReadingHistory() {
  const isLoggedIn = useIsLoggedIn();
  return useSimpleQuery(
    "reading-history",
    () =>
      isLoggedIn
        ? fetchReadingHistories()
        : Promise.resolve(LocalReadingHistory.get()),
    {
      staleTime: ms("2h"),
      cacheTime: ms("12h"),
    },
  );
}
