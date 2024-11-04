import { Schema, model, Document, Model, Types } from "mongoose";
import { UserDocument } from "./User";
import { PostDocument } from "../types";

const postSchema = new Schema<PostDocument>(
  {
    title: {
      type: String,
      validate: {
        validator: async function (title: string): Promise<boolean> {
          const postExists = await Post.exists({ title });
          return !postExists;
        },
        message: "Title already exists",
      },
      required: [true, "Title is required"],
    },
    alias: {
      type: String,
      validate: {
        validator: async function (alias: string): Promise<boolean> {
          const aliasExists = await Post.exists({ alias });
          return !aliasExists;
        },
        message: "Alias already exists",
      },
      required: [true, "Alias is required"],
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    cover: {
      type: String,
    },
    photos: {
      type: [String],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    commentStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = model<PostDocument>("Post", postSchema);
export default Post;
