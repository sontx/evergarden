import { UseQueryOptions } from "react-query";
import { GetStoryDto } from "@evergarden/shared";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import { useStoryHistory } from "../../histories/hooks/useStoryHistory";
import api from "../../../utils/api";

async function fetchStory(
  idOrSlug: string | number,
): Promise<GetStoryDto> {
  const response = await api.get(`/api/stories/${idOrSlug}`);
  return response.data;
}

export function useStory(
  slug: string | undefined,
  options?: UseQueryOptions<GetStoryDto>,
) {
  const { data, ...rest } = useSimpleQuery(
    ["story", slug],
    () => fetchStory(slug || ""),
    {
      enabled: !!slug,
      ...(options || {}),
    },
  );
  const story = useStoryHistory(data);
  return { ...rest, data: story };
}
