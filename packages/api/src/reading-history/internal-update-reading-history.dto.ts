import { UpdateReadingHistoryDto } from "@evergarden/shared";

export class InternalUpdateReadingHistoryDto extends UpdateReadingHistoryDto {
  id?: number;
  lastVisit: Date;
}
