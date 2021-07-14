import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.createdStories)
  createdBy: User;

  @Column({ type: "datetime", nullable: false })
  created: Date;

  @ManyToOne(() => User, (user) => user.updatedStories)
  updatedBy: User;

  @Column({ type: "datetime", nullable: false })
  updated: Date;
}
