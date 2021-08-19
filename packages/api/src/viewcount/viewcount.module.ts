import { Module } from "@nestjs/common";
import { ViewcountService } from "./viewcount.service";
import { HistoryChangedTrackerService } from "./history-changed-tracker.service";

@Module({
  providers: [ViewcountService, HistoryChangedTrackerService],
})
export class ViewcountModule {}
