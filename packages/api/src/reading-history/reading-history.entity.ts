import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { IdType } from "@evergarden/shared";
import { StoryHistory } from "./story-history.entity";

export type StoryHistories = { [x: string]: StoryHistory };

@Entity("histories")
export class ReadingHistory {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn({name: "_id"})
  id: IdType;

  @Column({ name: "storyHistories" })
  storyHistories: StoryHistories;
}
