// import { z } from 'zod';

// import { RoleTypeEnum, RoleLevelEnum } from './role.type.js';

// // 🔹 Base schema
// const roleBaseSchema = z.object({
//   name: z.nativeEnum(RoleTypeEnum, {
//     errorMap: () => ({ message: 'Invalid role type' }),
//   }),
//   level: z.nativeEnum(RoleLevelEnum, {
//     errorMap: () => ({ message: 'Invalid role level' }),
//   }),
//   isSystem: z.boolean().default(false),
//   description: z.string().min(6, 'description name must be at least 6 characters'),
//   isActive: z.boolean().default(true),
// });

// // 🔹 Create schema (all required)
// export const createRoleSchema = roleBaseSchema;

// // 🔹 Update schema (all optional)
// export const updateRoleSchema = roleBaseSchema.partial();

// // 🔹 Optional: Query params schema (for filters/search)
// export const queryRoleSchema = z.object({
//   name: z.nativeEnum(RoleTypeEnum).optional(),
//   isActive: z.boolean().optional(),
// });

// // 🔹 Export types
// export type CreateRoleInput = z.infer<typeof createRoleSchema>;
// export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
// export type QueryRoleInput = z.infer<typeof queryRoleSchema>;
