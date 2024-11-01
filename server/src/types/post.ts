import { Document } from "mongoose";

export interface PostDocument extends Document {
  title: string;
  alias: string;
  summary?: string;
  content: string;
  cover?: string;
  photos?: [string];
  userId: UserDocument["_id"];
  status: boolean;
  likes?: Types.Array<UserDocument["_id"]>;
  commentStatus: boolean;
}
