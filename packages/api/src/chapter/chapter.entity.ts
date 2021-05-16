import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { IdType } from "@evergarden/shared";

@Entity("chapters")
export class Chapter {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  id: IdType;

  @ObjectIdColumn()
  storyId: IdType;

  @Column({ type: "number", nullable: false })
  chapterNo: number;

  @Column({ type: "string", nullable: true })
  title?: string;

  @Column({ type: "string", nullable: false, select: false })
  content: string;

  @Column({ type: "datetime", nullable: false })
  updated: Date;

  @Column({ type: "number", nullable: true })
  published?: boolean;

  @Column({ type: "string", nullable: false })
  uploadBy: IdType;

  @Column({ type: "string", nullable: false })
  updatedBy: IdType;
}
