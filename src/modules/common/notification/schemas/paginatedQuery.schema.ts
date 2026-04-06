// import { z } from 'zod';

// // Define the query schema for pagination and search parameters
// export const PaginatedQuerySchema = z.object({
//   page: z
//     .string()
//     .optional()
//     .refine((val) => !val || /^[0-9]+$/.test(val), { message: 'Page must be a number' })
//     .transform((val) => (val ? parseInt(val, 10) : 1)), // default page 1

//   limit: z
//     .string()
//     .optional()
//     .refine((val) => !val || /^[0-9]+$/.test(val), { message: 'Limit must be a number' })
//     .transform((val) => (val ? parseInt(val, 10) : 10)), // default limit 10

//   search: z.string().max(100, 'Search term cannot exceed 100 characters').optional(),

//   // Optional filters (if you have any)
//   isActive: z
//     .string()
//     .refine((val) => val === 'true' || val === 'false', {
//       message: 'isActive must be true or false',
//     })
//     .optional()
//     .transform((val) => (val ? val === 'true' : undefined)), // Optional boolean filter for isActive

//   // Optional sorting (e.g., sort by name, creation date)
//   sortBy: z
//     .string()
//     .refine((val) => ['name', 'createdAt', 'modifiedAt'].includes(val), {
//       message: 'Invalid sort field',
//     })
//     .optional()
//     .default('createdAt'),

//   sortOrder: z
//     .string()
//     .optional()
//     .default('desc')
//     .refine((val) => ['asc', 'desc'].includes(val), {
//       message: 'Sort order must be "asc" or "desc"',
//     }),
// });

// export type QueryTemplateInput = z.infer<typeof PaginatedQuerySchema>;
