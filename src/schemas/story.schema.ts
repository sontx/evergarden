import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type StoryDocument = Story & mongoose.Document;

export interface Author {
  id: string;
  name: string;
}

export interface Genre {
  id: string;
  name: string;
}

@Schema()
export class Story {
  @Prop()
  url: string;

  @Prop()
  title: string;

  @Prop()
  description?: string;

  @Prop()
  thumbnail?: string;

  @Prop()
  cover?: string;

  @Prop()
  status: "ongoing" | "full";

  @Prop({ type: Object })
  authors?: Author[];

  @Prop({ type: Object })
  genres?: Genre[];

  @Prop({ type: Date })
  created: Date;

  @Prop({ type: Date })
  updated: Date;

  @Prop({ type: Number })
  view: number;

  @Prop({ type: Number })
  upvote: number;

  @Prop({ type: Number })
  downvote: number;

  @Prop({ type: Number })
  lastChapter?: number;

  @Prop({ type: Boolean })
  published?: boolean;

  @Prop()
  uploadBy: string;

  @Prop()
  updatedBy: string;
}

export const StorySchema = SchemaFactory.createForClass(Story);
