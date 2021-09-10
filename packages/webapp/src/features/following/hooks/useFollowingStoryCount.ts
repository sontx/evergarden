import { useReadingHistory } from "../../histories/hooks/useReadingHistory";

export function useFollowingStoryCount(defaultValue = 0) {
  const { data } = useReadingHistory();
  return data ? data.filter((item) => item.isFollowing).length : defaultValue;
}
