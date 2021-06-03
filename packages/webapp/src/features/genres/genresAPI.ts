import { GetGenreDto } from "@evergarden/shared";
import api from "../../utils/api";

export async function fetchAllGenres(): Promise<GetGenreDto[]> {
  const response = await api.get("/api/genres");
  return response.data;
}
