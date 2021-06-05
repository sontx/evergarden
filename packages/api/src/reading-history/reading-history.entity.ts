import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { StoryHistory } from "./story-history.entity";
import { ObjectID } from "mongodb";

export type StoryHistories = { [x: string]: StoryHistory };

@Entity("histories")
export class ReadingHistory {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn({ name: "_id" })
  id: ObjectID;

  @Column({ name: "storyHistories" })
  storyHistories: StoryHistories;
}
