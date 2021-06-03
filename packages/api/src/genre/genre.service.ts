import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetGenreDto } from "@evergarden/shared";
import { Genre } from "./genre.entity";
import genresDataset from "../genres.dataset";

@Injectable()
export class GenreService {
  private readonly logger = new Logger(GenreService.name);

  constructor(@InjectRepository(Genre) private genreRepository: Repository<Genre>) {
    this.logger.debug("Synchronizing genres dataset...");
    this.initializeDataset().then(() => {
      this.logger.debug("Synchronized genres dataset!");
    });
  }

  private async initializeDataset(): Promise<void> {
    await this.syncGenres(genresDataset.map((item) => item.name));
  }

  async getByName(name: string): Promise<GetGenreDto> {
    const found = await this.genreRepository.findOne({
      where: { name: new RegExp(`^${name}$`, "i") },
    });
    return this.toDto(found);
  }

  async getAll(): Promise<GetGenreDto[]> {
    const found = await this.genreRepository.find();
    return found.map(this.toDto);
  }

  toDto(genre: Genre): GetGenreDto {
    return (
      genre && {
        id: genre.id,
        name: genre.name,
      }
    );
  }

  async syncGenres(names: string[]): Promise<void> {
    for (const name of names) {
      const genre = await this.getByName(name);
      if (!genre) {
        const newGenre = this.genreRepository.create({ name });
        await this.genreRepository.save(newGenre);
      }
    }
  }

  async getValidGenres(genres: GetGenreDto[]): Promise<Genre[]> {
    const temp = [];
    for (const genre of genres) {
      const found = await this.getByName(genre.name);
      if (found) {
        temp.push(found);
      }
    }
    return temp;
  }
}
