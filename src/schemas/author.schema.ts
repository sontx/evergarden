import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type AuthorDocument = Author & mongoose.Document;

@Schema()
export class Author {
  @Prop()
  name: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
