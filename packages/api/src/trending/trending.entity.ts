import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("trending")
export class Trending {
  @PrimaryGeneratedColumn()
  storyId: number;

  @Column({ type: "float", nullable: false })
  score: number;
}
