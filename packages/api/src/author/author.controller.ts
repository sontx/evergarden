import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import JwtGuard from "../auth/jwt/jwt.guard";
import { AUTHOR_SEARCH_SERVICE_KEY, IAuthorSearchService } from "../search/interfaces/author-search.service";

@Controller("authors")
export class AuthorController {
  constructor(
    @Inject(AUTHOR_SEARCH_SERVICE_KEY)
    private authorSearchService: IAuthorSearchService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async search(@Query("search") search: string) {
    return await this.authorSearchService.search(search.trim());
  }
}
