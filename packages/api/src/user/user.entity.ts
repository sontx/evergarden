import { Exclude } from "class-transformer";
import { Entity, ObjectIdColumn, Column, PrimaryGeneratedColumn } from "typeorm";
import {IdType, OAuth2Provider, Role} from "@evergarden/shared";
import { UserSettings } from "./user-settings.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn({name: "_id"})
  id: IdType;

  @Column({ type: "string", nullable: false })
  email: string;

  @Column({ type: "string", nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true, type: "string" })
  provider: OAuth2Provider | null;

  @Column({ nullable: true, type: "string" })
  fullName: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({ nullable: true, type: "string" })
  role?: Role;

  @Column({ nullable: true, type: "string" })
  photoUrl?: string;

  @Column((type) => UserSettings)
  settings: UserSettings;

  @ObjectIdColumn({name: "historyId"})
  historyId?: IdType;
}
