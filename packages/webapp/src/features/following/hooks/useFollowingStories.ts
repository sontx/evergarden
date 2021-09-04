import { useReadingHistory } from "../../histories/hooks/useReadingHistory";
import { useSimpleQuery } from "../../../hooks/useSimpleQuery";
import { fetchStoriesByIds } from "../../stories/storiesAPI";

export function useFollowingStories() {
  const { data } = useReadingHistory();
  return useSimpleQuery(
    ["following-stories"],
    () =>
      fetchStoriesByIds(
        (data || [])
          .filter((item) => item.isFollowing)
          .map((item) => item.storyId),
      ),
    {
      enabled: !!data,
    },
  );
}
