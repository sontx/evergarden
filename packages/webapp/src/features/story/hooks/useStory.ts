import { UseQueryOptions } from "react-query";
import { GetStoryDto } from "@evergarden/shared";
import { useSimpleQuery } from "../../../hooks/useSimpleQuery";
import { fetchStory } from "../storyAPI";
import { useStoryHistory } from "../../histories/hooks/useStoryHistory";

export function useStory(slug: string, options?: UseQueryOptions<GetStoryDto>) {
  const { data, ...rest } = useSimpleQuery(
    ["story", slug],
    () => fetchStory(slug),
    options,
  );
  const story = useStoryHistory(data);
  return { ...rest, data: story };
}
