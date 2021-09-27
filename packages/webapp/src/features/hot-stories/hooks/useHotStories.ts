import api from "../../../utils/api";
import { GetStoryDto } from "@evergarden/shared";
import { useInfinitePageQuery } from "../../../hooks/api-query/useInfinitePageQuery";
import ms from "ms";

async function fetchHotStories(
  skip: number,
  limit: number,
): Promise<GetStoryDto[]> {
  const response = await api.get<GetStoryDto[]>("/api/stories", {
    params: { skip, limit, category: "hot" },
  });
  return response.data;
}

export default function useHotStories(queryKey: unknown[]) {
  const [page] = queryKey;
  return useInfinitePageQuery(["hot-stories", page], fetchHotStories, {
    staleTime: ms("5m"),
  });
}
