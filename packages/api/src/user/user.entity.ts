import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OAuth2Provider, Role } from "@evergarden/shared";
import { UserSettings } from "./user-settings";
import { Story } from "../story/story.entity";
import { ReadingHistory } from "../reading-history/reading-history.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "nvarchar", length: 50, unique: true })
  email: string;

  @Column({ type: "nvarchar", length: 50, nullable: true, select: false })
  @Exclude()
  password?: string;

  @Column({
    type: "enum",
    enum: ["google", "facebook"],
    default: null,
    nullable: true,
  })
  provider?: OAuth2Provider;

  @Column({ type: "nvarchar", length: 50, nullable: false })
  fullName: string;

  @Column({ type: "nvarchar", length: 255, nullable: true, select: false })
  @Exclude()
  refreshToken?: string;

  @Column({ type: "enum", enum: ["user", "mod", "admin"], default: "user" })
  role: Role;

  @Column({ type: "nvarchar", length: 500, nullable: true })
  photoUrl?: string;

  @Column({ type: "simple-json", nullable: true })
  settings: UserSettings;

  @OneToMany(() => Story, (story) => story.createdBy)
  createdStories: Promise<Story[]>;

  @OneToMany(() => Story, (story) => story.updatedBy)
  updatedStories: Promise<Story[]>;

  @OneToMany(() => ReadingHistory, (history) => history.user)
  histories: Promise<ReadingHistory[]>;
}
