import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { IdType, StoryStatus } from "@evergarden/shared";
import { Author } from "../author/author.entity";
import { Genre } from "../genre/genre.entity";

@Entity("stories")
export class Story {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn({ name: "_id" })
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

  @Column({ name: "authors" })
  authors?: Author[];

  @Column({ name: "genres" })
  genres?: Genre[];

  @Column({ type: "datetime", nullable: false })
  created: Date;

  @Column({ type: "datetime", nullable: false })
  updated: Date;

  @Column({ type: "number", nullable: false, default: 0 })
  view: number;

  @Column({ type: "number", nullable: false })
  upvote: number;

  @Column({ type: "number", nullable: false })
  downvote: number;

  @Column({ type: "number", nullable: true })
  lastChapter?: number;

  @Column({ type: "number", nullable: true })
  published?: boolean;

  @Column({ type: "string", nullable: false })
  uploadBy: IdType;

  @Column({ type: "string", nullable: false })
  updatedBy: IdType;
}
