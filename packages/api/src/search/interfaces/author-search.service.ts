import { AuthorSearchBody } from "@evergarden/shared";

export const AUTHOR_SEARCH_SERVICE_KEY = "AuthorSearchService";

export interface IAuthorSearchService {
  search(text: string): Promise<AuthorSearchBody[]>;
  initialize(): Promise<void>;
}
