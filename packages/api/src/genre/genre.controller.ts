import { Controller, Get, UseGuards } from "@nestjs/common";
import JwtGuard from "../auth/jwt/jwt.guard";
import { GenreService } from "./genre.service";
import genresDataset from "../genres.dataset";

@Controller("genres")
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAll() {
    return await this.genreService.getAll();
  }

  @Get("dataset")
  async getDataset() {
    return genresDataset;
  }
}
