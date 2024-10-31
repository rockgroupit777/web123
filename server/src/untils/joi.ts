import Joi, { ExtensionFactory } from 'joi'; // Import Joi
import { Types } from 'mongoose'; // Import Types from mongoose

// Create a custom Joi extension for validating MongoDB ObjectId
const objectIdExtension: ExtensionFactory = (joi) => ({
  type: 'objectId',
  base: joi.string(),
  messages: {
    objectId: '"{{#label}}" must be a valid Object ID', // Error message for invalid ObjectId
  },
  validate(value: unknown, helpers) {
    // Check if the value is a string and validate as ObjectId
    if (typeof value === 'string' && !Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error('objectId') }; // Return error if invalid
    }
  },
});

// Extend Joi with the ObjectId extension
const objectIdSchema = Joi.extend(objectIdExtension);

// Define the validation schema
export const objectIdValidate = objectIdSchema.object({
  id: objectIdSchema.objectId().label('ObjectId').required(), // Mark as required
});
