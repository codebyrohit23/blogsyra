import { EntityStatus, SortOrder } from '@/shared/constants';
import { zTrimmedStringSchema } from '@/shared/schemas';
import { z } from 'zod';

enum SortByEnum {
  RESOURCE = 'resource',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export const permissionPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),

  limit: z.number().int().min(1).max(100).default(10),

  search: zTrimmedStringSchema(1, 100, 'Search term cannot exceed 100 characters').optional(),

  status: z.nativeEnum(EntityStatus).default(EntityStatus.ACTIVE),

  sortBy: z.nativeEnum(SortByEnum).default(SortByEnum.CREATED_AT),

  sortOrder: z.nativeEnum(SortOrder).default(SortOrder.DESC),
});

export type PermissionPaginationDto = z.infer<typeof permissionPaginationSchema>;
