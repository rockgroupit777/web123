import { GraphQLError } from 'graphql';
import { User, UserDocument } from './models/User';

const ERRORS = {
  USER_NOT_FOUND: 'User not found',
  PASSWORD_MISMATCH: 'Incorrect password',
};

interface SignInArgs {
  email: string;
  password: string;
}

// Helper function to throw authentication errors
const throwAuthError = (message: string) => {
  throw new GraphQLError(message, {
    extensions: {
      code: 'UNAUTHENTICATED',
      http: { status: 401 },
    },
  });
};

const attemptSignIn = async (
  { email, password }: SignInArgs,
  fields?: string
): Promise<UserDocument> => {
  // Find user by email, applying field projection if specified
  const user = fields ? await User.findOne({ email }).select(fields) : await User.findOne({ email });

  // Check if user exists
  if (!user) {
    throwAuthError(ERRORS.USER_NOT_FOUND);
  }

  // Verify password
  const isMatch = await user.matchesPassword(password);
  if (!isMatch) {
    throwAuthError(ERRORS.PASSWORD_MISMATCH);
  }

  return user;
};

export default attemptSignIn;
