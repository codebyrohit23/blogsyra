import { buildKey } from '@/core/cache';
import { PermissionPaginationDto } from './schemas';

export const PERMISSION_REDIS_KEYS = {
  permissionById: (id: string) => buildKey('admin:permission', id),
  permission: (resource: string, action: string) =>
    buildKey('admin:permission', `${resource}:${action}`),

  permissionsList: (query: PermissionPaginationDto) =>
    buildKey(
      'permissions',
      `page:${query.page}`,
      `limit:${query.limit}`,
      `search:${query.search ?? 'none'}`,
      `status:${query.status}`,
      `sort:${query.sortBy}`,
      `order:${query.sortOrder}`
    ),

  patterns: {
    permissionById: () => buildKey('permission', '*'),
    permissionsList: () => buildKey('permissions', '*'),
    all: () => 'permission*',
  },
};
