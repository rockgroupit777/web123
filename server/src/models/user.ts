import { Schema, model, CallbackError} from "mongoose";
import { hash, compare } from "bcryptjs";
import {UserDocument,UserModel} from '../types'

// Define enums for role and permissions
enum UserRole {
  GUEST = "GUEST",
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}

enum Permission {
  CREATE_OWN = "CREATE_OWN",
  READ_OWN = "READ_OWN",
  UPDATE_OWN = "UPDATE_OWN",
  DELETE_OWN = "DELETE_OWN",
}

// Define the user schema
const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: async function (email: string) {
          const exists = await this.model('User').exists({ email });
          return !exists;
        },
        message: "Email already taken",
      },
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      validate: {
        validator: async function (username: string) {
          const exists = await this.model('User').exists({ username });
          return !exists;
        },
        message: "Username already taken",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permission),
      default: [Permission.CREATE_OWN, Permission.READ_OWN, Permission.UPDATE_OWN, Permission.DELETE_OWN],
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await User.hash(this.password);
    } catch (error) {
      return next(error as CallbackError);
    }
  }
  next();
});

// Static method to hash a password
userSchema.statics.hash = async function (password: string): Promise<string> {
  if (!password) {
    throw new Error("Password must be provided");
  }
  return await hash(password, 10);
};

// Instance method to compare passwords
userSchema.methods.matchesPassword = async function (password: string): Promise<boolean> {
  if (!password) {
    throw new Error("Password must be provided");
  }
  try {
    return await compare(password, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed");
  }
};

// Create and export the User model
const User = model<UserDocument, UserModel>('User', userSchema);
export default User;
