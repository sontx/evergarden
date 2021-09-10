import api from "../../../utils/api";
import { GetStoryDto } from "@evergarden/shared";
import { UseQueryOptions } from "react-query";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";

async function fetchUserStories(): Promise<GetStoryDto[]> {
  const response = await api.get("/api/stories", {
    params: { category: "user" },
  });
  return response.data;
}

export function useUserStories(options?: UseQueryOptions<GetStoryDto[]>) {
  return useSimpleQuery("user-stories", fetchUserStories, options);
}
