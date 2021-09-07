import { GetChapterDto } from "@evergarden/shared";
import { UseQueryOptions } from "react-query";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import { fetchChapter } from "../chapterAPI";
import ms from "ms";

export function useChapter(
  storyId: number | undefined,
  chapterNo: number,
  options?: UseQueryOptions<GetChapterDto>,
) {
  return useSimpleQuery(
    ["chapter", { storyId, chapterNo }],
    () => fetchChapter(storyId as number, chapterNo),
    {
      ...(options || {}),
      enabled: typeof storyId === "number",
      staleTime: ms("20m")
    },
  );
}
