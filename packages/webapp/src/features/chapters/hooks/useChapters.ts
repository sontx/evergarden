import { fetchRangeChapters } from "../chaptersAPI";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import { UseQueryOptions } from "react-query";
import { GetPreviewChapter } from "@evergarden/shared";

export function useChapters(
  storyId: number | undefined,
  from: number,
  to: number,
  options?: UseQueryOptions<GetPreviewChapter[]>,
) {
  return useSimpleQuery(
    ["chapters", storyId, { from, to }],
    async () => {
      const data = await fetchRangeChapters(
        storyId as number,
        from - 1,
        to - from + 1,
        "asc",
      );
      return data.items;
    },
    {
      enabled: typeof storyId === "number",
      ...(options || {}),
    },
  );
}
