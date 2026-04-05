import { z } from 'zod';

import { ActionEnum } from '../permission.type';
import { EntityStatus } from '@/shared/constants';

const permissionBaseSchema = z.object({
  resource: z.string().min(2, 'Resource must be at least 2 characters'),
  action: z.nativeEnum(ActionEnum),
  status: z.nativeEnum(EntityStatus),
});

export const createPermissionSchema = permissionBaseSchema.omit({ status: true }).strict();

export const updatePermissionSchema = permissionBaseSchema
  .strict()
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type CreatePermissionDto = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionDto = z.infer<typeof updatePermissionSchema>;
