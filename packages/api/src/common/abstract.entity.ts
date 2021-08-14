import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.createdStories, { eager: true })
  createdBy: User;

  @Column({ type: "timestamp", nullable: false })
  created: Date;

  @ManyToOne(() => User, (user) => user.updatedStories, { eager: true })
  updatedBy: User;

  @Column({ type: "timestamp", nullable: false })
  updated: Date;
}

