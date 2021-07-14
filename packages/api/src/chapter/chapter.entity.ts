import { Column, Entity, ManyToOne } from "typeorm";
import { Story } from "../story/story.entity";
import { AbstractEntity } from "../common/abstract.entity";

@Entity("chapters")
export class Chapter extends AbstractEntity {
  @Column({ type: "int" })
  chapterNo: number;

  @Column({ type: "nvarchar", length: 50, nullable: true })
  title?: string;

  @Column({ type: "mediumtext" })
  content: string;

  @Column({ type: "boolean", default: false })
  published?: boolean;

  @ManyToOne(() => Story, (story) => story.chapters)
  story: Promise<Story>;
}
