import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Author } from "./author.entity";
import { GetAuthorDto } from "@evergarden/shared";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthorCreatedEvent } from "../events/author-created.event";
import { AUTHOR_SEARCH_SERVICE_KEY, IAuthorSearchService } from "../search/interfaces/author-search.service";

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author) private authorRepository: Repository<Author>,
    @Inject(AUTHOR_SEARCH_SERVICE_KEY)
    private authorSearchService: IAuthorSearchService,
    private eventEmitter: EventEmitter2,
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

  search(name: string, limit: number): Promise<Author[]> {
    return this.authorRepository
      .createQueryBuilder("author")
      .where("LOWER(author.name) LIKE :name", { name: `%${name.trim().toLowerCase()}%` })
      .limit(limit)
      .getMany();
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
    const saved = await this.authorRepository.save(newAuthor);
    this.eventEmitter.emitAsync(AuthorCreatedEvent.name, new AuthorCreatedEvent(saved)).then();
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
