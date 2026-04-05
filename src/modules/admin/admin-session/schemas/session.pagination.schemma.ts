import { SessionStatus } from '@/modules/common/auth/types';
import { SortOrder } from '@/shared/constants';
import { z } from 'zod';

enum SortByEnum {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export const sessionPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),

  limit: z.number().int().min(1).max(100).default(10),

  status: z.nativeEnum(SessionStatus).default(SessionStatus.ACTIVE),

  sortBy: z.nativeEnum(SortByEnum).default(SortByEnum.CREATED_AT),

  sortOrder: z.nativeEnum(SortOrder).default(SortOrder.DESC),
});

export type SessionPaginationRequest = z.infer<typeof sessionPaginationSchema>;
