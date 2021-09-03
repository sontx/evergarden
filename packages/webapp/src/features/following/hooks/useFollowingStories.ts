import api from "../../../utils/api";
import { GetStoryDto } from "@evergarden/shared";
import { useReadingHistory } from "../../histories/hooks/useReadingHistory";
import { useSimpleQuery } from "../../../hooks/useSimpleQuery";

async function fetchStoriesByIds(ids: number[]): Promise<GetStoryDto[]> {
  const response = await api.get("/api/stories", {
    params: {
      ids,
    },
  });
  return response.data;
}

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
