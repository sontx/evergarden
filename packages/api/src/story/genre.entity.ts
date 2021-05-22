import { Column } from "typeorm";

export class Genre {
  @Column({ type: "string" })
  id: string;

  @Column({ type: "string" })
  name: string;
}
