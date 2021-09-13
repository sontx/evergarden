import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import { fetchStoriesByIds } from "../../stories/storiesAPI";
import { useReadingHistory } from "./useReadingHistory";

export function useRecent() {
  const { data } = useReadingHistory();
  return useSimpleQuery(
    ["recent"],
    () => {
      const history = data || [];
      return history.length > 0
        ? fetchStoriesByIds(history.map((item) => item.storyId))
        : Promise.resolve([]);
    },
    {
      enabled: !!data,
      staleTime: 0,
    },
  );
}
