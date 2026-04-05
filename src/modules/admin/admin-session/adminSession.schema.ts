// import { z } from 'zod';

// import { AdminDeviceEnum } from './adminSession.type';

// // 🔹 Enum for device type
// export const AdminDeviceType = z.enum(['web', 'mobile', 'desktop', 'tablet']);

// // 🔹 Base schema
// const adminDeviceSessionBaseSchema = z.object({
//   adminId: z
//     .string({
//       required_error: 'Admin Id is required',
//       invalid_type_error: 'Admin Id must be a string',
//     })
//     .regex(/^[0-9a-fA-F]{24}$/, {
//       message: 'Invalid Admin Id format',
//     }),

//   deviceId: z.string({
//     required_error: 'Device Id is required',
//     invalid_type_error: 'Device Id must be a string',
//   }),

//   // deviceType: AdminDeviceType,
//   deviceType: z.nativeEnum(AdminDeviceEnum, {
//     errorMap: () => ({ message: 'Invalid device type  name' }),
//   }),

//   os: z
//     .string({
//       invalid_type_error: 'OS must be a string',
//     })
//     .optional(),

//   ip: z
//     .string({
//       invalid_type_error: 'IP must be a string',
//     })
//     .ip('Invalid IP address')
//     .optional(),

//   location: z
//     .string({
//       invalid_type_error: 'Location must be a string',
//     })
//     .optional(),

//   fcmToken: z
//     .string({
//       invalid_type_error: 'FCM Token must be a string',
//     })
//     .optional(),

//   loggedInAt: z.date({
//     required_error: 'LoggedInAt is required',
//     invalid_type_error: 'LoggedInAt must be a valid date',
//   }),

//   lastActiveAt: z
//     .date({
//       invalid_type_error: 'LastActiveAt must be a valid date',
//     })
//     .optional(),

//   isActive: z.boolean({
//     required_error: 'isActive is required',
//     invalid_type_error: 'isActive must be a boolean',
//   }),

//   success: z.boolean({
//     required_error: 'success is required',
//     invalid_type_error: 'success must be a boolean',
//   }),
// });

// // 🔹 Create schema (all required)
// export const createAdminDeviceSessionSchema = adminDeviceSessionBaseSchema;

// // 🔹 Update schema (all optional)
// export const updateAdminDeviceSessionSchema = adminDeviceSessionBaseSchema.partial();

// // 🔹 Optional: Query params schema (for filters/search)
// export const queryAdminDeviceSessionSchema = z.object({
//   adminId: z
//     .string()
//     .regex(/^[0-9a-fA-F]{24}$/, {
//       message: 'Invalid Admin Id format',
//     })
//     .optional(),
//   deviceType: AdminDeviceType.optional(),
//   isActive: z.boolean().optional(),
//   success: z.boolean().optional(),
// });

// // 🔹 Export types
// export type CreateAdminDeviceSessionInput = z.infer<typeof createAdminDeviceSessionSchema>;
// export type UpdateAdminDeviceSessionInput = z.infer<typeof updateAdminDeviceSessionSchema>;
// export type QueryAdminDeviceSessionInput = z.infer<typeof queryAdminDeviceSessionSchema>;
