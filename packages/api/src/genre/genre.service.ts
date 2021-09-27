import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { GetGenreDto } from "@evergarden/shared";
import { Genre } from "./genre.entity";

@Injectable()
export class GenreService {
  constructor(@InjectRepository(Genre) private genreRepository: Repository<Genre>) {}

  async getByName(name: string): Promise<GetGenreDto> {
    const found = await this.genreRepository.findOne({
      where: { name },
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

  async getValidGenres(genres: GetGenreDto[], entityManager?: EntityManager): Promise<Genre[]> {
    const temp = [];
    for (const genre of genres) {
      const found = entityManager
        ? await entityManager.findOne(Genre, genre.id)
        : await this.genreRepository.findOne(genre.id);
      if (found) {
        temp.push(found);
      }
    }
    return temp;
  }
}
