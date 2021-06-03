import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { IdType } from "@evergarden/shared";

@Entity("authors")
export class Author {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn({ name: "_id" })
  id: IdType;

  @Column({ type: "string", unique: true })
  name: string;
}
