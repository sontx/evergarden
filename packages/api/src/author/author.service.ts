import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOneOptions, Repository } from "typeorm";
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

  async getByName(name: string, entityManger?: EntityManager): Promise<GetAuthorDto> {
    const findOptions: FindOneOptions<Author> = {
      where: { name },
    };
    const found = entityManger
      ? await entityManger.findOne(Author, findOptions)
      : await this.authorRepository.findOne(findOptions);
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

  private async add(name: string, entityManger?: EntityManager): Promise<GetAuthorDto> {
    const newAuthor = { name };
    const savedAuthor = entityManger
      ? await entityManger.save(Author, newAuthor)
      : await this.authorRepository.save(newAuthor);
    this.eventEmitter.emitAsync(AuthorCreatedEvent.name, new AuthorCreatedEvent(savedAuthor)).then();
    return this.toDto(savedAuthor);
  }

  async syncAuthors(authors: GetAuthorDto[], entityManger?: EntityManager): Promise<GetAuthorDto[]> {
    const syncList = [];
    for (const author of authors) {
      const name = author.name.trim();
      if (name) {
        const existingAuthor = await this.getByName(name, entityManger);
        if (!existingAuthor) {
          const newAuthor = await this.add(name, entityManger);
          syncList.push(newAuthor);
        } else {
          syncList.push(existingAuthor);
        }
      }
    }
    return syncList;
  }
}
