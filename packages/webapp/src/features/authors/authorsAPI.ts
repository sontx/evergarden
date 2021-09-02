import { GetAuthorDto } from "@evergarden/shared";
import api from "../../utils/api";

export async function searchAuthor(name: string): Promise<GetAuthorDto[]> {
  const response = await api.get("/api/authors", { params: { search: name } });
  return response.data;
}
