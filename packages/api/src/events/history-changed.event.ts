import { UpdateReadingHistoryDto } from "@evergarden/shared/lib/common-types";

export class HistoryChangedEvent {
  constructor(
    public readonly change: UpdateReadingHistoryDto,
    public readonly triggerAt: Date,
    public readonly userId: number,
  ) {}
}
