import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Author } from "./author.entity";
import { GetAuthorDto } from "@evergarden/shared";

@Injectable()
export class AuthorService {
  constructor(@InjectRepository(Author) private authorRepository: Repository<Author>) {}

  async getByName(name: string): Promise<GetAuthorDto> {
    const found = await this.authorRepository.findOne({
      where: { name: new RegExp(`^${name}$`, "i") },
    });
    return this.toDto(found);
  }

  async search(name: string): Promise<GetAuthorDto[]> {
    const found = name
      ? await this.authorRepository.find({
          where: { name: new RegExp(`${name}`, "i") },
        })
      : await this.authorRepository.find();
    return found.map(this.toDto);
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
