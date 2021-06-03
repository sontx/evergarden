import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import JwtGuard from "../auth/jwt/jwt.guard";
import { AuthorService } from "./author.service";
import { trimText } from "../../../webapp/src/utils/types";
import {delay, isDevelopment} from "../utils";

@Controller("authors")
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Get()
  @UseGuards(JwtGuard)
  async search(@Query("search") search: string) {
    if (isDevelopment()) {
      await delay(2000);
    }
    return await this.authorService.search(trimText(search));
  }
}
