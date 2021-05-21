import { Column } from "typeorm";
import { SizeType } from "@evergarden/shared";

export class UserSettings {
  @Column({ type: "string" })
  readingFontSize: SizeType;

  @Column({ type: "string" })
  readingFont: string;

  @Column({ type: "string" })
  readingLineSpacing: SizeType;
}
