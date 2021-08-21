import { UpdateReadingHistoryDto } from "@evergarden/shared";

export class HistoryChangedEvent {
  constructor(
    public readonly change: UpdateReadingHistoryDto,
    public readonly triggerAt: Date,
    public readonly userId: number,
  ) {}
}
