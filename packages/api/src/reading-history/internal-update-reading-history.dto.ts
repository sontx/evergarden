import { UpdateReadingHistoryDto } from "@evergarden/shared";

export class InternalUpdateReadingHistoryDto extends UpdateReadingHistoryDto {
  lastVisit: Date;
}
