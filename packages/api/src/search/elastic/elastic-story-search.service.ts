import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Story } from "../../story/story.entity";
import { SearchResult, StorySearchBody } from "@evergarden/shared";
import { OnEvent } from "@nestjs/event-emitter";
import { StoryCreatedEvent } from "../../events/story-created.event";
import { StoryUpdatedEvent } from "../../events/story-updated.event";
import { StoryDeletedEvent } from "../../events/story-deleted.event";
import { IStorySearchService } from "../interfaces/story-search.service";
import { StoryService } from "../../story/story.service";

@Injectable()
export default class ElasticStorySearchService implements IStorySearchService {
  private static readonly index = "stories";

  private readonly logger = new Logger(ElasticStorySearchService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(forwardRef(() => StoryService))
    private storyService: StoryService,
  ) {}

  @OnEvent(StoryCreatedEvent.name)
  async handleStoryCreatedEvent(event: StoryCreatedEvent) {
    await this.add(event.createdStory);
  }

  @OnEvent(StoryUpdatedEvent.name)
  async handleStoryUpdatedEvent(event: StoryUpdatedEvent) {
    await this.update(event.updatedStory);
  }

  @OnEvent(StoryDeletedEvent.name)
  async handleStoryDeletedEvent(event: StoryDeletedEvent) {
    await this.remove(event.storyId);
  }

  async initialize(): Promise<void> {
    if (!(await this.indexExists())) {
      const stories = await this.storyService.getAll();
      await this.createIndex(stories);
    }
  }

  private async indexExists(): Promise<boolean> {
    const checkIndex = await this.elasticsearchService.indices.exists({ index: ElasticStorySearchService.index });
    return checkIndex.statusCode !== 404;
  }

  private async createIndex(stories: Story[]) {
    this.elasticsearchService.indices.create(
      {
        index: ElasticStorySearchService.index,
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
            _index: ElasticStorySearchService.index,
            _id: story.id,
          },
        },
        this.toSearchBody(story),
      );
    }

    this.elasticsearchService.bulk(
      {
        index: ElasticStorySearchService.index,
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

  private async remove(storyId: number) {
    this.elasticsearchService.deleteByQuery({
      index: ElasticStorySearchService.index,
      body: {
        query: {
          match: {
            id: storyId,
          },
        },
      },
    });
  }

  private async update(story: Story) {
    const newBody = this.toSearchBody(story);
    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, "");

    return this.elasticsearchService.updateByQuery({
      index: ElasticStorySearchService.index,
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

  private async add(story: Story) {
    return this.elasticsearchService.index<SearchResult<StorySearchBody>, StorySearchBody>({
      index: ElasticStorySearchService.index,
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
    const { body } = await this.elasticsearchService.search<SearchResult<StorySearchBody>>({
      index: ElasticStorySearchService.index,
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
