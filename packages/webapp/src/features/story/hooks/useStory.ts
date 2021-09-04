import { UseQueryOptions } from "react-query";
import { GetStoryDto } from "@evergarden/shared";
import { useSimpleQuery } from "../../../hooks/useSimpleQuery";
import { fetchStory } from "../storyAPI";

export function useStory(slug: string, options?: UseQueryOptions<GetStoryDto>) {
  return useSimpleQuery(["story", slug], () => fetchStory(slug), options);
}
