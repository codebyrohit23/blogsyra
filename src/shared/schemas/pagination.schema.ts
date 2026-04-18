import z from 'zod';
import { EntityStatus } from '../constants';
import { zTrimmedStringSchema } from './zod-helpers';

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),

  limit: z.number().int().min(1).max(100).default(10),

  search: zTrimmedStringSchema(1, 100, 'Search term cannot exceed 100 characters').optional(),

  status: z.nativeEnum(EntityStatus).default(EntityStatus.ACTIVE),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
