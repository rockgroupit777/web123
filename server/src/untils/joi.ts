import Joi, { ExtensionFactory, StringSchema } from "@hapi/joi"; // Ensure you're using the correct Joi version
import { Types } from "mongoose";

// Create a custom Joi extension for validating ObjectId
export const objectId: ExtensionFactory = (Joi) => ({
  type: "objectId",
  base: Joi.string(),
  messages: {
    objectId: '"{{#label}}" must be a valid Object ID',
  },
  validate(value: unknown, helpers) {
    // Check if the value is a valid ObjectId
    if (typeof value === 'string' && !Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error("objectId") };
    }
  },
});

// Create a Joi schema that includes the ObjectId extension
export const objectIdValidate = Joi.object({
  id: Joi.extend(objectId).objectId().label("ObjectId").required(), // Mark as required if necessary
});

