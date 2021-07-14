import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Story } from "../story/story.entity";

@Entity("authors")
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "nvarchar", length: 50, unique: true })
  name: string;

  @ManyToMany(() => Story, (story) => story.authors)
  stories: Story[];
}
