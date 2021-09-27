import api from "../../../utils/api";
import { GetStoryDto } from "@evergarden/shared";
import { UseInfiniteQueryOptions } from "react-query";
import { useInfinitePageQuery } from "../../../hooks/api-query/useInfinitePageQuery";

async function fetchHotStories(
  skip: number,
  limit: number,
): Promise<GetStoryDto[]> {
  const response = await api.get<GetStoryDto[]>("/api/stories", {
    params: { skip, limit, category: "hot" },
  });
  return response.data;
}

export default function useHotStories(
  queryKey: unknown[],
  options?: UseInfiniteQueryOptions<GetStoryDto[]>,
) {
  const [page] = queryKey;
  return useInfinitePageQuery(["hot-stories", page], fetchHotStories, options);
}
