import { Module } from "@nestjs/common";
import { ViewcountService } from "./viewcount.service";
import { RedisHistoryChangedTrackerService } from "./redis/redis-history-changed-tracker.service";
import { HISTORY_CHANGED_TRACKER_SERVICE } from "./interfaces/history-changed-tracker.service";
import { useMicroservices } from "../common/utils";
import { LocalHistoryChangedTrackerService } from "./local/local-history-changed-tracker.service";

@Module({
  providers: [
    ViewcountService,
    {
      provide: HISTORY_CHANGED_TRACKER_SERVICE,
      useClass: useMicroservices() ? RedisHistoryChangedTrackerService : LocalHistoryChangedTrackerService,
    },
  ],
})
export class ViewcountModule {}
