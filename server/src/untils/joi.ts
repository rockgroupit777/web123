import Joi, { ExtensionFactory, ObjectSchema } from 'joi'; // Import Joi
import { Types } from 'mongoose'; // Import Types from mongoose

// Custom Joi extension for validating MongoDB ObjectId
const objectIdExtension: ExtensionFactory = (joi) => ({
  type: 'objectId',
  base: joi.string().length(24).hex(), // Ensures the string is 24 characters long and hexadecimal
  messages: {
    objectId: '"{{#label}}" must be a valid Object ID', // Error message for invalid ObjectId
  },
  validate(value: unknown, helpers) {
    if (typeof value === 'string' && !Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error('objectId') }; // Return error if invalid
    }
  },
});

// Extend Joi with the ObjectId extension
const objectIdSchema = Joi.extend(objectIdExtension);

// Define the validation schema
export const objectIdValidate: ObjectSchema = objectIdSchema.object({
  id: objectIdSchema.objectId().label('ObjectId').required(), // Mark as required
});

// Function to validate the input against the schema
export async function validateInput(input: { id: string }): Promise<void> {
  try {
    const validated = await objectIdValidate.validateAsync(input); // Validate the input
    console.log('Valid Object ID:', validated.id);
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      console.error('Validation error:', error.details.map((detail) => detail.message));
    } else {
      console.error('Unexpected error:', error);
    }; // Handle validation error
  }
}

// Example test cases
(async () => {
  await validateInput({ id: '507f191e810c19729de860ea' }); // Valid ObjectId
  await validateInput({ id: 'invalidObjectId' }); // Invalid ObjectId
})();
