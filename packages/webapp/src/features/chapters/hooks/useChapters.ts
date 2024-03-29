import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import { UseQueryOptions } from "react-query";
import { GetChapterDto, GetPreviewChapter } from "@evergarden/shared";
import api from "../../../utils/api";

async function fetchRangeChapters(
  storyId: number,
  skip: number,
  limit: number,
  sort: string,
): Promise<GetChapterDto[]> {
  const response = await api.get(`/api/stories/${storyId}/chapters`, {
    params: {
      skip,
      limit,
      includesContent: false,
      sort,
    },
  });
  return response.data.items;
}

export function useChapters(
  storyId: number | undefined,
  from: number,
  to: number,
  options?: UseQueryOptions<GetPreviewChapter[]>,
) {
  return useSimpleQuery(
    ["chapters", storyId, { from, to }],
    () => fetchRangeChapters(storyId as number, from - 1, to - from + 1, "asc"),
    {
      enabled: typeof storyId === "number",
      ...(options || {}),
    },
  );
}
