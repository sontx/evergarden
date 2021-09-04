import { useSimpleQuery } from "../../../hooks/useSimpleQuery";
import { fetchStoriesByIds } from "../../stories/storiesAPI";
import { useReadingHistory } from "./useReadingHistory";

export function useRecent() {
  const { data } = useReadingHistory();
  return useSimpleQuery(
    ["recent"],
    () => fetchStoriesByIds((data || []).map((item) => item.storyId)),
    {
      enabled: !!data,
    },
  );
}
