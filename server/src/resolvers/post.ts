import { PubSub } from 'graphql-subscriptions';
import { fields, objectId, objectIdValidate } from "../utils";
import { Post, PostDocument, createPostValidate } from "./";
import { GraphQLResolveInfo } from "graphql";

const pubsub = new PubSub();

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

interface UpdatePostArgs {
  postId: string;
  updatePostInput: {
    title?: string;
    content?: string;
    // Add other fields that are updatable
  };
}

interface DeletePostArgs {
  postId: string;
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
  // Update a post
  updatePost: async (
    parent: unknown,
    args: UpdatePostArgs,
    context: unknown,
    info: GraphQLResolveInfo
  ): Promise<PostDocument | null> => {
    try {
      await objectIdValidate.validateAsync(args.postId);
      await updatePostValidate.validateAsync(args.updatePostInput, { abortEarly: false });
      
      const updatedPost = await Post.findByIdAndUpdate(
        args.postId,
        args.updatePostInput,
        { new: true } // Returns the updated document
      ).exec();
      
      if (!updatedPost) throw new Error("Post not found");

      // Publish the updated post event
      pubsub.publish('POST_UPDATED', { postUpdated: updatedPost });

      return updatedPost;
    } catch (error) {
      throw new Error(`Failed to update post: ${(error as Error).message}`);
    }
  },

  // Delete a post
  deletePost: async (
    parent: unknown,
    args: DeletePostArgs,
    context: unknown,
    info: GraphQLResolveInfo
  ): Promise<PostDocument | null> => {
    try {
      await objectIdValidate.validateAsync(args.postId);

      const deletedPost = await Post.findByIdAndDelete(args.postId).exec();
      if (!deletedPost) throw new Error("Post not found");

      // Publish the deleted post event
      pubsub.publish('POST_DELETED', { postDeleted: deletedPost });

      return deletedPost;
    } catch (error) {
      throw new Error(`Failed to delete post: ${(error as Error).message}`);
    }
  },
};

export const postSubscription = {
  postCreated: {
    subscribe: () => pubsub.asyncIterator<PostDocument>('POST_CREATED')
  },
  postUpdated: {
    subscribe: () => pubsub.asyncIterator<PostDocument>('POST_UPDATED')
  },

  postDeleted: {
    subscribe: () => pubsub.asyncIterator<PostDocument>('POST_DELETED')
  }
};
