import { PubSub } from 'graphql-subscriptions'; // Import PubSub for subscriptions
import { Request } from 'express'; // Import Request type from Express
import jwt from 'jsonwebtoken'; // Import JWT for token handling
import { UserDocument, User } from './models/User'; // Assuming you have a User model
import { signUpValidate, updateUserValidate, signInValidate } from './validation'; // Import validation schemas
import config from './config'; // Import configuration for JWT secret

const pubsub = new PubSub();
const USER_ADDED = "USER_ADDED";

// User Queries
const userQueries = {
  users: async (
    parent: unknown,
    args: Record<string, unknown>,
    context: any,
    info: any
  ): Promise<UserDocument[]> => {
    // Fetch all users (pagination can be implemented here)
    return await User.find({}, fields(info)).exec();
  },

  user: async (
    parent: unknown,
    args: { userId: string },
    context: any,
    info: any
  ): Promise<UserDocument | null> => {
    try {
      await objectIdValidate.validateAsync(args);
      return await User.findById(args.userId, fields(info));
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  },
};

// User Mutations
const userMutations = {
  signUp: async (parent: unknown, { createUserInput }: { createUserInput: any }) => {
    try {
      await signUpValidate.validateAsync(createUserInput, { abortEarly: false });
      const user = await User.create(createUserInput);
      pubsub.publish(USER_ADDED, { userAdded: user });

      const token = jwt.sign(
        { userId: user._id, role: user.role, permissions: user.permissions },
        config.jwtSecret,
        { expiresIn: '1h' } // Set expiration to 1 hour
      );

      return {
        userId: user._id,
        role: user.role,
        permissions: user.permissions,
        token,
        tokenExpiration: 3600, // 1 hour in seconds
      };
    } catch (error) {
      throw new Error(`Sign up failed: ${error.message}`);
    }
  },

  updateUser: async (
    parent: unknown,
    { userId, updateUserInput }: { userId: string; updateUserInput: any },
    context: { isAuth: boolean }
  ) => {
    if (!context.isAuth) {
      throw new Error("User is not authenticated");
    }

    try {
      await updateUserValidate.validateAsync(updateUserInput, { abortEarly: false });
      const updatedUser = await User.findByIdAndUpdate(userId, updateUserInput, { new: true });
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  signIn: async (
    parent: unknown,
    { email, password }: { email: string; password: string },
    req: Request,
    info: any
  ) => {
    try {
      await signInValidate.validateAsync({ email, password }, { abortEarly: false });
      const user = await attemptSignIn({ email, password });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
          permissions: user.permissions,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        config.jwtSecret,
        { expiresIn: '1h' } // Set expiration to 1 hour
      );

      return {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions,
        token,
        tokenExpiration: 3600, // 1 hour in seconds
      };
    } catch (error) {
      throw new Error(`Sign in failed: ${error.message}`);
    }
  },
};

// User Subscriptions
const userSubscriptions = {
  userAdded: {
    subscribe: () => pubsub.asyncIterator([USER_ADDED]),
  },
};

export { userQueries, userMutations, userSubscriptions };
