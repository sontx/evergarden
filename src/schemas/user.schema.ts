import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  fullName: string;

  @Prop()
  role?: "user" | "admin" | "mod";

  @Prop()
  photoUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
