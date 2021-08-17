import { Check, Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { StoryStatus } from "@evergarden/shared";
import { Author } from "../author/author.entity";
import { Genre } from "../genre/genre.entity";
import { Chapter } from "../chapter/chapter.entity";
import { AbstractEntity } from "../common/abstract.entity";
import { ReadingHistory } from "../reading-history/reading-history.entity";

@Entity("stories")
@Check(`"view" >= 0`)
@Check(`"upvote" >= 0`)
@Check(`"downvote" >= 0`)
@Check(`"lastChapter" is NULL OR lastChapter > 0`)
export class Story extends AbstractEntity {
  @Column({ type: "nvarchar", length: 255, unique: true })
  url: string;

  @Column({ type: "nvarchar", length: 255, unique: true })
  title: string;

  @Column({ type: "nvarchar", length: 8000, nullable: true })
  description?: string;

  @Column({ type: "nvarchar", length: 2000, nullable: true })
  thumbnail?: string;

  @Column({ type: "nvarchar", length: 2000, nullable: true })
  cover?: string;

  @Column({
    type: "enum",
    enum: ["full", "ongoing"],
    nullable: false,
    default: "ongoing",
  })
  status: StoryStatus;

  @ManyToMany(() => Author, (author) => author.stories, { cascade: true, eager: true })
  @JoinTable()
  authors: Author[];

  @ManyToMany(() => Genre, (genre) => genre.stories, { cascade: true, eager: true })
  @JoinTable()
  genres: Genre[];

  @Column({ type: "int", default: 0 })
  view: number;

  @Column({ type: "int", default: 0 })
  upvote: number;

  @Column({ type: "int", default: 0 })
  downvote: number;

  @Column({ type: "int", nullable: true })
  lastChapter?: number;

  @Column({ type: "boolean", default: false })
  published: boolean;

  @OneToMany(() => Chapter, (chapter) => chapter.story, { cascade: true })
  chapters: Promise<Chapter[]>;

  @OneToMany(() => ReadingHistory, (history) => history.story)
  histories: Promise<ReadingHistory[]>;
}
