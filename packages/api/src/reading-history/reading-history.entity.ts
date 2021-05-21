import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { IdType } from "@evergarden/shared";
import { StoryHistory } from "./story-history.entity";

@Entity("histories")
export class ReadingHistory {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  id: IdType;

  @Column((type) => StoryHistory)
  storyHistories: {[x: string]: StoryHistory};
}
