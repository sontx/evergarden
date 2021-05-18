import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { IdType } from "@evergarden/shared";

@Entity("chapters")
export class Chapter {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  id: IdType;

  @ObjectIdColumn({name: "storyId"})
  storyId: IdType;

  @Column({ type: "number", nullable: false })
  chapterNo: number;

  @Column({ type: "string", nullable: true })
  title?: string;

  @Column({ type: "string", nullable: false })
  content: string;

  @Column({ type: "datetime", nullable: false })
  created: Date;

  @Column({ type: "datetime", nullable: false })
  updated: Date;

  @Column({ type: "number", nullable: true })
  published?: boolean;

  @Column({ type: "string", nullable: false })
  uploadBy: IdType;

  @Column({ type: "string", nullable: false })
  updatedBy: IdType;
}
