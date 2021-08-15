import { Injectable, Logger } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Story } from "../story/story.entity";
import { StorySearchBody, StorySearchResult } from "@evergarden/shared";

@Injectable()
export default class StorySearchService {
  private static readonly index = "stories";

  private readonly logger = new Logger(StorySearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createIndex(stories: Story[]) {
    const checkIndex = await this.elasticsearchService.indices.exists({ index: StorySearchService.index });
    if (checkIndex.statusCode === 404) {
      this.elasticsearchService.indices.create(
        {
          index: StorySearchService.index,
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
                title: {
                  type: "text",
                  fields: {
                    complete: {
                      type: "text",
                      analyzer: "autocomplete_analyzer",
                      search_analyzer: "autocomplete_search_analyzer",
                    },
                  },
                },
                description: {
                  type: "text",
                  index: false,
                },
                id: {
                  type: "long",
                  index: false,
                },
                thumbnail: {
                  type: "text",
                  index: false,
                },
                url: {
                  type: "text",
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
      for (const story of stories) {
        body.push(
          {
            index: {
              _index: StorySearchService.index,
              _id: story.id,
            },
          },
          this.toSearchBody(story),
        );
      }

      this.elasticsearchService.bulk(
        {
          index: StorySearchService.index,
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
  }

  async remove(storyId: number) {
    this.elasticsearchService.deleteByQuery({
      index: StorySearchService.index,
      body: {
        query: {
          match: {
            id: storyId,
          },
        },
      },
    });
  }

  async update(story: Story) {
    const newBody = this.toSearchBody(story);
    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, "");

    return this.elasticsearchService.updateByQuery({
      index: StorySearchService.index,
      body: {
        query: {
          match: {
            id: story.id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }

  async add(story: Story) {
    return this.elasticsearchService.index<StorySearchResult, StorySearchBody>({
      index: StorySearchService.index,
      body: this.toSearchBody(story),
    });
  }

  private toSearchBody(story: Story) {
    return {
      id: story.id,
      url: story.url,
      title: story.title,
      description: story.description,
      thumbnail: story.thumbnail,
    };
  }

  async search(text: string): Promise<StorySearchBody[]> {
    const { body } = await this.elasticsearchService.search<StorySearchResult>({
      index: StorySearchService.index,
      body: {
        from: 0,
        size: 10,
        query: {
          multi_match: {
            query: text,
            fields: ["title"],
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
