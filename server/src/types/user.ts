import { Document, Model } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string; // Optional if not always provided
  role: string;
  permissions: string[]; // Changed to a more standard array syntax
  matchesPassword(password: string): Promise<boolean>; // Improved syntax
}

export interface UserModel extends Model<UserDocument> {
  hash(password: string): Promise<string>; // Improved syntax
}
