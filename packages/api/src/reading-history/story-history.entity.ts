import { Column } from "typeorm";
import { IdType, VoteType } from "@evergarden/shared";

export class StoryHistory {
  @Column({ type: "string" })
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

  @Column({ type: "boolean", default: false })
  isFollowing: boolean;
}
