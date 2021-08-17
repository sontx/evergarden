import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Author } from "./author.entity";
import { GetAuthorDto } from "@evergarden/shared";
import AuthorSearchService from "../search/author-search.service";

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author) private authorRepository: Repository<Author>,
    private authorSearchService: AuthorSearchService,
  ) {}

  async getAll(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  async getByName(name: string): Promise<GetAuthorDto> {
    const found = await this.authorRepository.findOne({
      where: { name },
    });
    return this.toDto(found);
  }

  async search(name: string): Promise<GetAuthorDto[]> {
    const result = await this.authorSearchService.search(name);
    return result.map((item) => ({ id: item.id, name: item.name }));
  }

  toDto(author: Author): GetAuthorDto {
    return (
      author && {
        id: author.id,
        name: author.name,
      }
    );
  }

  private async add(name: string): Promise<GetAuthorDto> {
    const newAuthor = await this.authorRepository.create({ name });
    return this.toDto(await this.authorRepository.save(newAuthor));
  }

  async syncAuthors(authors: GetAuthorDto[]): Promise<GetAuthorDto[]> {
    const syncList = [];
    for (const author of authors) {
      const name = author.name.trim();
      if (name) {
        const existingAuthor = await this.getByName(name);
        if (!existingAuthor) {
          const newAuthor = await this.add(name);
          syncList.push(newAuthor);
        } else {
          syncList.push(existingAuthor);
        }
      }
    }
    return syncList;
  }
}
