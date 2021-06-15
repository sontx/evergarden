import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type ChapterDocument = Chapter & mongoose.Document;

@Schema()
export class Chapter {
  @Prop()
  storyId: string;

  @Prop({ type: Number })
  chapterNo: number;

  @Prop()
  title?: string;

  @Prop()
  content: string;

  @Prop({ type: Date })
  created: Date;

  @Prop({ type: Date })
  updated: Date;

  @Prop({ type: Boolean })
  published?: boolean;

  @Prop()
  uploadBy: string;

  @Prop()
  updatedBy: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
