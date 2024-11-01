import { GraphQLError } from 'graphql';
import { User, UserDocument } from './models/User';

const ERRORS = {
  INCORRECT_CREDENTIALS: 'Incorrect email or password, please try again',
};

interface SignInArgs {
  email: string;
  password: string;
}

const attemptSignIn = async (
  { email, password }: SignInArgs,
  fields?: string
): Promise<UserDocument> => {
  // Find user by email with optional field projection
  const user = await User.findOne({ email }).select(fields || '');

  // Validate user existence and password
  if (!user || !(await user.matchesPassword(password))) {
    throw new GraphQLError(ERRORS.INCORRECT_CREDENTIALS, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  return user;
};

export default attemptSignIn;
