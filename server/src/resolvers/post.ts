import { fields, objectId, objectIdValidate } from "../utils";
import { Post, PostDocument, createPostValidate } from "./";
import { GraphQLResolveInfo } from "graphql";

interface PostArgs {
  postId: string;
}

interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
  // Add other specific fields relevant to your Post model
}

interface CreatePostArgs {
  createPostInput: CreatePostInput;
}

export const postQueries = {
  posts: async (
    parent: unknown,
    args: unknown,
    context: unknown,
    info: GraphQLResolveInfo
  ): Promise<PostDocument[]> => {
    try {
      return await Post.find({}).exec();
    } catch (error) {
      throw new Error(`Failed to fetch posts: ${(error as Error).message}`);
    }
  },

  post: async (
    parent: unknown,
    args: PostArgs,
    context: unknown,
    info: GraphQLResolveInfo
  ): Promise<PostDocument | null> => {
    try {
      await objectIdValidate.validateAsync(args.postId);
      const post = await Post.findById(args.postId).exec();
      if (!post) throw new Error("Post not found");
      return post;
    } catch (error) {
      throw new Error(`Failed to fetch post: ${(error as Error).message}`);
    }
  },
};

export const postMutation = {
  createPost: async (
    parent: unknown,
    args: CreatePostArgs,
    context: unknown,
    info: GraphQLResolveInfo
  ): Promise<PostDocument> => {
    try {
      await createPostValidate.validateAsync(args.createPostInput, {
        abortEarly: false,
      });
      const newPost = await Post.create(args.createPostInput);
      return newPost;
    } catch (error) {
      throw new Error(`Failed to create post: ${(error as Error).message}`);
    }
  },
};

export const postSubscription = {};
