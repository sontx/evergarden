import { Exclude } from "class-transformer";
import { Entity, ObjectIdColumn, Column, PrimaryGeneratedColumn } from "typeorm";
import { IdType, Role } from "@evergarden/common";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  id: IdType;

  @Column({ type: "string", nullable: false })
  email: string;

  @Column({ type: "string", nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true, type: "string" })
  provider: "google" | "facebook" | null;

  @Column({ nullable: true, type: "string" })
  fullName: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({nullable: true, type: "string"})
  role?: Role;

  @Column({nullable: true, type: "string"})
  photoUrl?: string;
}
