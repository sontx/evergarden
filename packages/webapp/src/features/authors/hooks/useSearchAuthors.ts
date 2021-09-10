import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import api from "../../../utils/api";
import { GetAuthorDto } from "@evergarden/shared";
import ms from "ms";

async function searchAuthor(name: string): Promise<GetAuthorDto[]> {
  const response = await api.get("/api/authors", { params: { search: name } });
  return response.data;
}

export function useSearchAuthors(name: string) {
  return useSimpleQuery(["authors", name], () => searchAuthor(name), {
    enabled: !!name,
    staleTime: ms("0s"),
    cacheTime: ms("10s"),
  });
}
