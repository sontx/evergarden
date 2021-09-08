import api from "../../../utils/api";
import { GetGenreDto } from "@evergarden/shared";
import { useSimpleQuery } from "../../../hooks/api-query/useSimpleQuery";
import ms from "ms";

async function fetchAllGenres(): Promise<GetGenreDto[]> {
  const response = await api.get("/api/genres");
  return response.data;
}

export function useGenres() {
  return useSimpleQuery("genres", fetchAllGenres, {
    staleTime: ms("4h"),
    cacheTime: ms("5h"),
  });
}
