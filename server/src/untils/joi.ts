import Joi, { ExtensionFactory, ObjectSchema, ValidationError } from 'joi';
import { Types } from 'mongoose';

// Custom Joi extension for validating MongoDB ObjectId
const objectIdExtension: ExtensionFactory = (joi) => ({
  type: 'objectId',
  base: joi.string().length(24).hex(), // Ensures a 24-character hex string
  messages: {
    'objectId.base': '"{{#label}}" must be a valid Object ID', // Custom error message
  },
  validate(value: unknown, helpers) {
    if (typeof value === 'string' && !Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error('objectId.base') };
    }
    return { value }; // Pass validation
  },
});

// Extend Joi with the ObjectId extension
const extendedJoi = Joi.extend(objectIdExtension);

// Define the validation schema
export const objectIdValidate: ObjectSchema<{ id: string }> = extendedJoi.object({
  id: extendedJoi.objectId().label('ObjectId').required(),
});

// Function to validate the input against the schema
export async function validateInput(input: { id: string }): Promise<void> {
  try {
    // Validate the input
    const validated = await objectIdValidate.validateAsync(input);
    console.log('Valid Object ID:', validated.id);
  } catch (error) {
    // Type narrowing to handle Joi validation error
    if (error instanceof ValidationError) {
      console.error(
        'Validation error:',
        error.details.map((detail) => detail.message)
      );
    } else {
      console.error('Unexpected error:', error);
    }
  }
}