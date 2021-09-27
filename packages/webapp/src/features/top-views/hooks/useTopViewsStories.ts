import api from "../../../utils/api";
import { GetStoryDto } from "@evergarden/shared";
import { UseInfiniteQueryOptions } from "react-query";
import { useInfinitePageQuery } from "../../../hooks/api-query/useInfinitePageQuery";

async function fetchTopViews(
  skip: number,
  limit: number,
  type: string,
): Promise<GetStoryDto[]> {
  const response = await api.get<GetStoryDto[]>("/api/stories", {
    params: { skip, limit, category: "new" },
  });
  return response.data;
}

export default function useTopViewsStories(
  queryKey: unknown[],
  options?: UseInfiniteQueryOptions<GetStoryDto[]>,
) {
  const [page, type] = queryKey;
  return useInfinitePageQuery(
    ["top-stories", type, page],
    (skip, limit, queryKey) =>
      fetchTopViews(skip, limit, queryKey![1] as string),
    options,
  );
}
