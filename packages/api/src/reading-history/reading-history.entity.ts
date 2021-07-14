import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { VoteType } from "@evergarden/shared";
import { Story } from "../story/story.entity";
import { User } from "../user/user.entity";

@Entity("histories")
export class ReadingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  currentChapterNo: number;

  @Column({ type: "datetime" })
  started: Date;

  @Column({ type: "datetime" })
  lastVisit: Date;

  @Column({ type: "float" })
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
  story: Promise<Story>;

  @ManyToOne(() => User, (user) => user.histories)
  user: Promise<User>;
}
