import { Controller, Get, UseGuards } from "@nestjs/common";
import JwtGuard from "../auth/jwt/jwt.guard";
import { GenreService } from "./genre.service";
import genresDataset from "../genres.dataset";
import { delay, isDevelopment } from "../utils";

@Controller("genres")
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAll() {
    if (isDevelopment()) {
      await delay(2000);
    }
    return await this.genreService.getAll();
  }

  @Get("dataset")
  async getDataset() {
    return genresDataset;
  }
}
