import { buildKey } from '@/core/cache';
import { RolePaginationDto } from './schemas';

export const ROLE_REDIS_KEYS = {
  roleById: (id: string) => buildKey('role', id),

  rolesList: (query: RolePaginationDto) =>
    buildKey(
      'roles',
      `page:${query.page}`,
      `limit:${query.limit}`,
      `search:${query.search ?? 'none'}`,
      `status:${query.status}`,
      `sort:${query.sortBy}`,
      `order:${query.sortOrder}`
    ),

  patterns: {
    roleById: () => buildKey('role', '*'),
    rolesList: () => buildKey('roles', '*'),
    all: () => 'role*',
  },
};
