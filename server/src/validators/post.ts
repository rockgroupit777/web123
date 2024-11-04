import Joi from "joi";
import { objectId } from "../utils";

// Define field validators with labels
const title = Joi.string().required().label("Title");
const alias = Joi.string().required().label("Alias");
const summary = Joi.string().required().label("Summary");
const content = Joi.string().required().label("Content");
const cover = Joi.string().optional().label("Cover");
const photos = Joi.array().items(Joi.string()).optional().label("Photos");
const userId = Joi.extend(objectId).objectId().required().label("User Id");
const status = Joi.boolean().default(true).label("Status");
const commentStatus = Joi.boolean().default(true).label("Comment Status");

// Define likes as an array of user object IDs
const likes = Joi.array()
  .items(Joi.extend(objectId).objectId().label("User"))
  .label("Likes");

// Schema for validating the post creation
export const createPostValidate = Joi.object({
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

