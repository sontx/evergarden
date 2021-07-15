import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique
} from "typeorm";
import { VoteType } from "@evergarden/shared";
import { Story } from "../story/story.entity";
import { User } from "../user/user.entity";

@Entity("histories")
@Unique(["storyId", "userId"])
@Check(`"currentChapterNo" >= 0`)
@Check(`"currentReadingPosition" >= 0`)
export class ReadingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", default: 0 })
  currentChapterNo: number;

  @Column({ type: "datetime" })
  started: Date;

  @Column({ type: "datetime" })
  lastVisit: Date;

  @Column({ type: "float", default: 0 })
  currentReadingPosition: number;

  @Column({
    type: "enum",
    enum: ["upvote", "downvote", "none"],
    nullable: true,
    default: "none",
  })
  vote: VoteType;

  @Column({ type: "boolean", default: false })
  isFollowing: boolean;

  @ManyToOne(() => Story)
  @JoinColumn({ name: "storyId" })
  story: Promise<Story>;

  @Column()
  @RelationId((history: ReadingHistory) => history.story)
  storyId: number;

  @ManyToOne(() => User, (user) => user.histories)
  @JoinColumn({ name: "userId" })
  user: Promise<User>;

  @Column()
  @RelationId((history: ReadingHistory) => history.user)
  userId: number;
}
