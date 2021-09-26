import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("view_hits")
export class ViewHit {
  @PrimaryColumn({ type: "bigint", nullable: false })
  storyId: number;

  @Column({ type: "int", nullable: false })
  view: number;

  @PrimaryColumn({ type: "datetime", nullable: false })
  createdAt: Date;
}
