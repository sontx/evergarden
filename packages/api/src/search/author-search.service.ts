import { Injectable, Logger } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { AuthorSearchBody, SearchResult } from "@evergarden/shared";
import { Author } from "../author/author.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { AuthorCreatedEvent } from "../events/author-created.event";

@Injectable()
export default class AuthorSearchService {
  private static readonly index = "authors";

  private readonly logger = new Logger(AuthorSearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @OnEvent(AuthorCreatedEvent.name, {async: true})
  async handleAuthorCreatedEvent(event: AuthorCreatedEvent) {
    await this.add(event.createdAuthor);
  }

  async indexExists(): Promise<boolean> {
    const checkIndex = await this.elasticsearchService.indices.exists({ index: AuthorSearchService.index });
    return checkIndex.statusCode !== 404;
  }

  async createIndex(authors: Author[]) {
    this.elasticsearchService.indices.create(
      {
        index: AuthorSearchService.index,
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
            _index: AuthorSearchService.index,
            _id: author.id,
          },
        },
        this.toSearchBody(author),
      );
    }

    this.elasticsearchService.bulk(
      {
        index: AuthorSearchService.index,
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
      index: AuthorSearchService.index,
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
      index: AuthorSearchService.index,
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
      index: AuthorSearchService.index,
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
      index: AuthorSearchService.index,
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
