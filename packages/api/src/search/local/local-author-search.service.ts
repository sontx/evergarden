import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthorSearchBody } from "@evergarden/shared";
import { IAuthorSearchService } from "../interfaces/author-search.service";
import { AuthorService } from "../../author/author.service";

const MAX_SEARCH_RESULTS = 50;

@Injectable()
export class LocalAuthorSearchService implements IAuthorSearchService {
  constructor(
    @Inject(forwardRef(() => AuthorService))
    private authorService: AuthorService,
  ) {}

  async search(text: string): Promise<AuthorSearchBody[]> {
    if (!text || text.trim().length === 0) {
      return [];
    }

    const found = await this.authorService.search(text, MAX_SEARCH_RESULTS);
    return found.map((author) => ({
      id: author.id,
      name: author.name,
    }));
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }
}
