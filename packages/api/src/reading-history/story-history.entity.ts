import {Column, ObjectIdColumn} from "typeorm";
import {IdType, VoteType} from "@evergarden/shared";

export class StoryHistory {
  @ObjectIdColumn({ name: "storyId" })
  storyId: IdType;

  @Column({ type: "number", nullable: false })
  currentChapterNo: number;

  @Column({ type: "datetime", nullable: false })
  started: Date;

  @Column({ type: "datetime", nullable: false })
  lastVisit: Date;

  @Column({ type: "number", nullable: false })
  currentReadingPosition: number;

  @Column({ type: "string", nullable: true })
  vote: VoteType;
}
