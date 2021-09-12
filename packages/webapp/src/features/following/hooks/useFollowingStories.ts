import { useReadingHistory } from "../../histories/hooks/useReadingHistory";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import { fetchStoriesByIds } from "../../stories/storiesAPI";

export function useFollowingStories() {
  const { data } = useReadingHistory();
  return useSimpleQuery(
    "following-stories",
    () => {
      const following = (data || []).filter((item) => item.isFollowing);
      return following.length > 0
        ? fetchStoriesByIds(following.map((item) => item.storyId))
        : Promise.resolve([]);
    },
    {
      enabled: !!data,
    },
  );
}
