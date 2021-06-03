import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { IdType } from "@evergarden/shared";

@Entity("genres")
export class Genre {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn({ name: "_id" })
  id: IdType;

  @Column({ type: "string", unique: true })
  name: string;
}
