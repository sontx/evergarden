import {Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn} from "typeorm";
import {IdType, StoryStatus} from "@evergarden/shared";

@Entity("stories")
export class Story {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  id: IdType;

  @Column({ type: "string", nullable: false, unique: true })
  url: string;

  @Column({ type: "string", nullable: false })
  title: string;

  @Column({ type: "string", nullable: true })
  description?: string;

  @Column({ type: "string", nullable: true })
  thumbnail?: string;

  @Column({ type: "string", nullable: false })
  status: StoryStatus;

  @Column({ type: "simple-array", nullable: true })
  authors: string[];

  @Column({ type: "simple-array", nullable: true })
  genres: string[];

  @Column({ type: "datetime", nullable: false })
  created: Date;

  @Column({ type: "datetime", nullable: false })
  updated: Date;

  @Column({ type: "number", nullable: false, default: 0 })
  view: number;

  @Column({ type: "number", nullable: true })
  rating?: number;

  @Column({ type: "number", nullable: true })
  lastChapter?: number;

  @Column({ type: "number", nullable: true })
  published?: boolean;

  @Column({type: "string", nullable: false})
  uploadBy: IdType;

  @Column({type: "string", nullable: false})
  updatedBy: IdType;
}
