import { Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";
import { UserDocument, UserModel } from ".";

const userSchema = new Schema(
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
        default: "MEMBER",
      },
      permissions: {
        type: [String],
        default: ["CREATE_OWN", "READ_OWN", "UPDATE_OWN", "DELETE_OWN"],
      },
    },
    { timestamps: true }
  );

// Hash the password before saving the user
userSchema.pre<UserDocument>("save", async function (this: UserDocument) {
    if (this.isModified("password")) {
      this.password = await User.hash(this.password);
    }
  });
  
  // Static method to hash a password
  userSchema.statics.hash = async function (password: string): Promise<string> {
    if (!password) {
      throw new Error("Password must be provided");
    }
    
    return await hash(password, 10);
  };
  
  // Instance method to compare a password
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

const User = model<UserDocument, UserModel>('User', userSchema);

export default User;
