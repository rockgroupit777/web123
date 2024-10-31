import Joi, { ObjectSchema } from 'joi'; // Import Joi

// Email validation schema
const emailSchema = Joi.string()
  .email()
  .min(7)
  .max(254)
  .trim()
  .required()
  .label('Email');

// Username validation schema
const usernameSchema = Joi.string()
  .alphanum()
  .min(2)
  .max(50)
  .trim()
  .required()
  .label('UserName');

// Password validation schema with custom regex
const passwordSchema = Joi.string()
  .min(8)
  .max(100)
  .pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d).*$/, { name: 'password' })
  .message('Password must have at least one uppercase letter, one lowercase letter, and one digit')
  .required()
  .label('Password');

// Repeat password reference
const repeatPasswordSchema = Joi.ref('password');

// Optional fields
const firstNameSchema = Joi.string()
  .max(50)
  .trim()
  .label('FirstName');

const lastNameSchema = Joi.string()
  .max(50)
  .trim()
  .label('LastName');

const avatarSchema = Joi.string().label('Avatar');

// Sign up validation schema
export const signUpValidate: ObjectSchema = Joi.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  repeatPassword: repeatPasswordSchema,
  firstName: firstNameSchema.optional(), // Optional fields
  lastName: lastNameSchema.optional(), // Optional fields
  avatar: avatarSchema.optional(), // Optional fields
});

// Sign in validation schema
export const signInValidate: ObjectSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

// Update user validation schema
export const updateUserValidate: ObjectSchema = Joi.object({
  password: passwordSchema.optional(), // Optional field for updates
  repeatPassword: repeatPasswordSchema.optional(), // Optional field for updates
  firstName: firstNameSchema.optional(), // Optional fields
  lastName: lastNameSchema.optional(), // Optional fields
  avatar: avatarSchema.optional(), // Optional fields
});

