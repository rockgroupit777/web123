import Joi from 'joi'; // Import Joi
import { Types } from 'mongoose'; // Ensure mongoose is installed

// Create a custom Joi extension for validating MongoDB ObjectId
const objectId = Joi.extend((joi) => ({
  type: 'objectId',
  base: joi.string(),
  messages: {
    objectId: '"{{#label}}" must be a valid Object ID',
  },
  validate(value: unknown, helpers) {
    // Check if the value is a string and is a valid ObjectId
    if (typeof value === 'string' && !Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error('objectId') }; // Return error if invalid
    }
  },
}));

// Create a Joi schema that includes the ObjectId extension
export const objectIdValidate = Joi.object({
  id: objectId.objectId().label('ObjectId').required(), // Mark as required
});
