import Joi, { ObjectSchema } from "joi";
import { objectIdValidate } from "../untils"; // Assuming this is a valid utility for ObjectId validation

// Define field validators with labels
const title = Joi.string().required().label("Title");
const alias = Joi.string().required().label("Alias");
const summary = Joi.string().required().label("Summary");
const content = Joi.string().required().label("Content");
const cover = Joi.string().optional().label("Cover");
const photos = Joi.array().items(Joi.string()).optional().label("Photos");
const userId = objectIdValidate.label("User Id").required();
const status = Joi.boolean().default(true).label("Status");
const commentStatus = Joi.boolean().default(true).label("Comment Status");

// Define likes as an array of user object IDs
const likes = Joi.array().items(objectIdValidate.label("User")).label("Likes");

// Schema for validating the post creation
export const createPostValidate: ObjectSchema<CreatePostInput> = Joi.object({
  title,
  alias,
  summary,
  content,
  cover,
  photos,
  userId,
  status,
  likes,
  commentStatus,
});

// Define TypeScript interface for type checking the validation
export interface CreatePostInput {
  title: string;
  alias: string;
  summary: string;
  content: string;
  cover?: string;
  photos?: string[];
  userId: string;
  status?: boolean;
  likes?: string[];
  commentStatus?: boolean;
}
