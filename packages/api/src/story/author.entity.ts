import { Column } from "typeorm";

export class Author {
  @Column({ type: "string" })
  id: string;

  @Column({ type: "string" })
  name: string;
}
