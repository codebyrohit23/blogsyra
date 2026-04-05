// src/shared/schemas/role.schema.ts
import { EntityStatus } from '@/shared/constants';
import { zObjectId, zTrimmedStringSchema } from '@/shared/schemas';
import { z } from 'zod';

// Base role fields
const rolebaseSchema = z.object({
  name: zTrimmedStringSchema(2, 50, 'Role name must be 2-50 characters'),

  isSuperAdmin: z.boolean().default(false),

  permissions: z
    .array(zObjectId('Permission id is invalid'))
    .refine(
      (permissions) => permissions.length === new Set(permissions).size,
      'Duplicate permission are not allowed'
    ),
  description: zTrimmedStringSchema(10, 255, 'Description is must be 10-255 characters'),

  status: z.nativeEnum(EntityStatus),
});

// Create schema (all required)
export const createRoleSchema = rolebaseSchema.omit({ status: true }).strict();

// Update schema (all optional, must provide at least one field)
export const updateRoleSchema = rolebaseSchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// Type inference
export type CreateRoleDto = z.infer<typeof createRoleSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
