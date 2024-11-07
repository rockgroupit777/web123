import { fields, objectId, objectIdValidate } from "../utils";
import { Post, PostDocument, createPostValidate } from "./";
import { GraphQLResolveInfo } from "graphql";

interface PostArgs {
  postId: string;
}

interface CreatePostInput {
  createPostInput: any; // Define a specific type for the input if possible
}

export const postQueries = {
  posts: async (
    parent: unknown,
    args: unknown,
    context: unknown,
    info: GraphQLResolveInfo
  ): Promise<PostDocument[]> => {
    return await Post.find({}).exec();
  },

  post: async (
    parent: unknown,
    args: PostArgs,
    context: unknown,
    info: GraphQLResolveInfo
  ): Promise<PostDocument | null> => {
    try {
      await objectIdValidate.validateAsync(args.postId);
      return await Post.findById(args.postId).exec();
    } catch (error) {
      throw error;
    }
  },
};

export const postMutation = {
  createPost: async (
    parent: unknown,
    args: CreatePostInput,
    context: unknown,
    info: GraphQLResolveInfo
  ): Promise<PostDocument> => {
    try {
      await createPostValidate.validateAsync(args.createPostInput, {
        abortEarly: false,
      });
      return await Post.create(args.createPostInput);
    } catch (error) {
      throw error;
    }
  },
};

export const postSubscription = {};
