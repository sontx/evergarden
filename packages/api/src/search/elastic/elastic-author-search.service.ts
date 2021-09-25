import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { AuthorSearchBody, SearchResult } from "@evergarden/shared";
import { Author } from "../../author/author.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { AuthorCreatedEvent } from "../../events/author-created.event";
import { IAuthorSearchService } from "../interfaces/author-search.service";
import { AuthorService } from "../../author/author.service";

@Injectable()
export default class ElasticAuthorSearchService implements IAuthorSearchService {
  private static readonly index = "authors";

  private readonly logger = new Logger(ElasticAuthorSearchService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(forwardRef(() => AuthorService))
    private authorService: AuthorService,
  ) {}

  @OnEvent(AuthorCreatedEvent.name, { async: true })
  private async handleAuthorCreatedEvent(event: AuthorCreatedEvent) {
    await this.add(event.createdAuthor);
  }

  async initialize(): Promise<void> {
    if (!(await this.indexExists())) {
      const authors = await this.authorService.getAll();
      await this.createIndex(authors);
    }
  }

  private async indexExists(): Promise<boolean> {
    const checkIndex = await this.elasticsearchService.indices.exists({ index: ElasticAuthorSearchService.index });
    return checkIndex.statusCode !== 404;
  }

  private async createIndex(authors: Author[]) {
    this.elasticsearchService.indices.create(
      {
        index: ElasticAuthorSearchService.index,
        body: {
          settings: {
            analysis: {
              analyzer: {
                autocomplete_analyzer: {
                  tokenizer: "autocomplete",
                  filter: ["lowercase"],
                },
                autocomplete_search_analyzer: {
                  tokenizer: "keyword",
                  filter: ["lowercase"],
                },
              },
              tokenizer: {
                autocomplete: {
                  type: "edge_ngram",
                  min_gram: 1,
                  max_gram: 30,
                  token_chars: ["letter", "digit", "whitespace"],
                },
              },
            },
          },
          mappings: {
            properties: {
              name: {
                type: "text",
                fields: {
                  complete: {
                    type: "text",
                    analyzer: "autocomplete_analyzer",
                    search_analyzer: "autocomplete_search_analyzer",
                  },
                },
              },
              id: {
                type: "long",
                index: false,
              },
            },
          },
        },
      },
      (err) => {
        if (err) {
          this.logger.error(err.message);
          this.logger.error("Error while config indexing for elastic search", err.stack);
        }
      },
    );
    const body = [];
    for (const author of authors) {
      body.push(
        {
          index: {
            _index: ElasticAuthorSearchService.index,
            _id: author.id,
          },
        },
        this.toSearchBody(author),
      );
    }

    this.elasticsearchService.bulk(
      {
        index: ElasticAuthorSearchService.index,
        body,
      },
      (err) => {
        if (err) {
          this.logger.error(err.message);
          this.logger.error("Error while indexing for elastic search", err.stack);
        }
      },
    );
  }

  private async remove(authorId: number) {
    this.elasticsearchService.deleteByQuery({
      index: ElasticAuthorSearchService.index,
      body: {
        query: {
          match: {
            id: authorId,
          },
        },
      },
    });
  }

  private async update(author: Author) {
    const newBody = this.toSearchBody(author);
    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, "");

    return this.elasticsearchService.updateByQuery({
      index: ElasticAuthorSearchService.index,
      body: {
        query: {
          match: {
            id: author.id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }

  private async add(author: Author) {
    return this.elasticsearchService.index<SearchResult<AuthorSearchBody>, AuthorSearchBody>({
      index: ElasticAuthorSearchService.index,
      body: this.toSearchBody(author),
    });
  }

  private toSearchBody(author: Author) {
    return {
      id: author.id,
      name: author.name,
    };
  }

  async search(text: string): Promise<AuthorSearchBody[]> {
    const { body } = await this.elasticsearchService.search<SearchResult<AuthorSearchBody>>({
      index: ElasticAuthorSearchService.index,
      body: {
        from: 0,
        size: 10,
        query: {
          multi_match: {
            query: text,
            fields: ["name"],
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits
      .map((item) => item._source)
      .map((item) => ({
        ...item,
      }));
  }
}
