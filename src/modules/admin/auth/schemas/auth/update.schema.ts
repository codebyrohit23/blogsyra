// import { z } from 'zod';

// export const updateSchema = z
//   .object({
//     firstName: z
//       .string()
//       .min(2, 'First name must be at least 2 characters')
//       .max(50, 'First name cannot exceed 50 characters')
//       .optional(),

//     lastName: z
//       .string()
//       .min(2, 'Last name must be at least 2 characters')
//       .max(50, 'Last name cannot exceed 50 characters')
//       .optional(),

//     email: z
//       .string()
//       .email('Invalid email address')
//       .min(5, 'Email must be at least 5 characters')
//       .max(100, 'Email cannot exceed 100 characters')
//       .optional(),

//     username: z
//       .string()
//       .regex(usernameRegex, 'Username can only contain letters, numbers and underscores')
//       .min(3, 'Username must be at least 3 characters')
//       .max(30, 'Username cannot exceed 30 characters')
//       .optional(),

//     phone: z
//       .string()
//       .regex(phoneRegex, 'Please enter a valid phone number')
//       .min(5, 'Please enter a valid phone number')
//       .max(15, 'Please enter a valid phone number')
//       .optional(),

//     roles: z
//       .array(z.string().regex(OBJECT_Id_REGEX, 'Invalid Role ID'))
//       .min(1, 'At least one role must be assigned')
//       .optional(),

//     department: z.string().max(50, 'Department cannot exceed 50 characters').optional(),
//     jobTitle: z.string().max(50, 'Job title cannot exceed 50 characters').optional(),

//     avatar: z.string().regex(OBJECT_Id_REGEX, 'Invalid image ID').optional(),

//     language: z
//       .string()
//       .min(2, "Language code must be at least 2 characters (e.g., 'en').")
//       .max(10, 'Language code cannot exceed 10 characters.')
//       .regex(/^[a-z]{2,}(-[A-Z]{2,})?$/, "Invalid language code format (e.g., 'en' or 'en-US').")
//       .optional(),

//     notes: z.string().max(500, 'Notes cannot exceed 500 characters.').optional(),
//   })
//   // Ensure at least one key is provided
//   .refine((data) => Object.keys(data).length > 0, {
//     message: 'At least one field must be provided for update.',
//   });

// export type updateInput = z.infer<typeof updateSchema>;
