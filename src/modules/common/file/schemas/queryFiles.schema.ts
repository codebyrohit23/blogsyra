// import { z } from 'zod';

// import { StorageProviderEnum, UploadStatusEnum } from '../file.type';

// export const queryFileSchema = z.object({
//   /* ---------- Pagination ---------- */
//   page: z
//     .string()
//     .optional()
//     .refine((val) => !val || /^[0-9]+$/.test(val), { message: 'Page must be a number' })
//     .transform((val) => (val ? parseInt(val, 10) : 1)),

//   limit: z
//     .string()
//     .optional()
//     .refine((val) => !val || /^[0-9]+$/.test(val), { message: 'Limit must be a number' })
//     .transform((val) => (val ? parseInt(val, 10) : 10)),

//   /* ---------- Search ---------- */
//   search: z.string().max(100, 'Search term cannot exceed 100 characters').optional(),

//   /* ---------- Filtering ---------- */
//   storageProvider: z
//     .nativeEnum(StorageProviderEnum)
//     .optional()
//     .describe('Filter by storage provider (s3, gcs, azure, minio)'),

//   uploadStatus: z.nativeEnum(UploadStatusEnum).optional().describe('Filter by upload status'),

//   used: z
//     .string()
//     .refine((val) => val === 'true' || val === 'false', {
//       message: 'Used must be true or false',
//     })
//     .optional()
//     .transform((val) => (val ? val === 'true' : undefined)),

//   isDeleted: z
//     .string()
//     .refine((val) => val === 'true' || val === 'false', {
//       message: 'isDeleted must be true or false',
//     })
//     .optional()
//     .transform((val) => (val ? val === 'true' : undefined)),

//   ownerType: z.string().optional(),
//   ownerId: z.string().optional(),

//   /* ---------- Sorting ---------- */
//   sortBy: z
//     .string()
//     .optional()
//     .refine(
//       (val) =>
//         !val ||
//         [
//           'createdAt',
//           'updatedAt',
//           'originalName',
//           'size',
//           'storageProvider',
//           'uploadStatus',
//         ].includes(val),
//       { message: 'Invalid sort field' }
//     )
//     .default('createdAt'),

//   sortOrder: z
//     .string()
//     .optional()
//     .default('desc')
//     .refine((val) => ['asc', 'desc'].includes(val), {
//       message: 'Sort order must be "asc" or "desc"',
//     }),
// });

// export type QueryFileInput = z.infer<typeof queryFileSchema>;
