import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ViewHit } from "./view-hit.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { ViewIncreasedEvent } from "../events/view-increased.event";
import { IViewHitsCacheService, VIEW_HITS_CACHE_SERVICE_KEY } from "./interfaces/view-hits-cache.service";
import * as moment from "moment";
import { forEachChunk } from "../common/utils";
import { toInt } from "@evergarden/shared";

export interface ViewHitScore {
  storyId: number;
  score: number;
}

@Injectable()
export class ViewHitService {
  constructor(
    @InjectRepository(ViewHit)
    private viewHitRepository: Repository<ViewHit>,
    @Inject(VIEW_HITS_CACHE_SERVICE_KEY)
    private viewHitsCacheService: IViewHitsCacheService,
  ) {}

  @OnEvent(ViewIncreasedEvent.name, { async: true })
  private async handleViewIncreasedEvent(event: ViewIncreasedEvent) {
    await this.viewHitsCacheService.add(event);
  }

  private async updateViewHits() {
    const hits = await this.viewHitsCacheService.popAll();
    console.log(hits);
    if (hits.length === 0) {
      return;
    }

    await this.viewHitRepository.manager.transaction(async (entityManager) => {
      const yesterday = moment().subtract(1, "days");
      await entityManager.query("DELETE FROM view_hits WHERE createdAt < ?", [
        yesterday.toISOString().slice(0, 19).replace("T", " "),
      ]);
      await forEachChunk(hits, 1000, async (chunk) => {
        await entityManager.insert(ViewHit, chunk);
      });
    });
  }

  async getViewHitScores(): Promise<ViewHitScore[]> {
    await this.updateViewHits();
    const result = (await this.viewHitRepository.query(`
      SELECT storyId, 1.0*SUM((x-xbar)*(y-ybar+1))/SUM((x-xbar)*(x-xbar)) AS score
      FROM(
        SELECT storyId,
          avg(view) OVER(PARTITION BY storyId) AS ybar, view AS y,
          avg(TIME_TO_SEC(createdAt)) OVER(PARTITION BY storyId) AS xbar, TIME_TO_SEC(createdAt) AS x
        FROM view_hits
      ) AS calcs
      GROUP BY storyId
    `)) as ViewHitScore[];
    return result.filter((item) => item.score !== null);
  }

  async getTopViews(limit: number, skip: number): Promise<{ storyId: number; total: number }[]> {
    const result = (await this.viewHitRepository.query(
      "SELECT storyId, SUM(view) AS total FROM view_hits GROUP BY storyId ORDER BY total DESC LIMIT ? OFFSET ?",
      [limit, skip],
    )) as any[];
    return result.map((item) => ({ storyId: toInt(item.storyId), total: toInt(item.total) }));
  }
}
