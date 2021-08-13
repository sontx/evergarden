import { Check, Column, Entity, JoinColumn, ManyToOne, RelationId, Unique } from "typeorm";
import { Story } from "../story/story.entity";
import { AbstractEntity } from "../common/abstract.entity";

@Entity("chapters")
@Unique(["storyId", "chapterNo"])
@Check(`"chapterNo" > 0`)
export class Chapter extends AbstractEntity {
  @Column({ type: "int" })
  chapterNo: number;

  @Column({ type: "nvarchar", length: 255, nullable: true })
  title?: string;

  @Column({ type: "mediumtext" })
  content: string;

  @Column({ type: "boolean", default: false })
  published?: boolean;

  @ManyToOne(() => Story, (story) => story.chapters)
  @JoinColumn({ name: "storyId" })
  story: Promise<Story>;

  @Column()
  @RelationId((chapter: Chapter) => chapter.story)
  storyId: number;
}
