import { buildKey, CacheVersionService } from '@/infra/cache';
import { MongoId } from '@/shared/types';
import { toStringId } from '@/shared/utils';
import { AdminPaginationDto } from './schemas';

export const AdminCacheKeys = {
  byId: (id: MongoId) => buildKey('admin', toStringId(id)),

  list: (queryKey: string, version: number) => buildKey('admins', `v${version}`, queryKey),
};

export const ADMIN_CACHE_VERSION_KEYS = {
  LIST: 'admins:list:version',
};

export class AdminCacheVersion {
  constructor(private readonly version: CacheVersionService) {}

  async getListVersion() {
    return this.version.get(ADMIN_CACHE_VERSION_KEYS.LIST);
  }

  async bumpListVersion() {
    return this.version.bump(ADMIN_CACHE_VERSION_KEYS.LIST);
  }
}

export const buildQueryKey = (query: AdminPaginationDto) => {
  const parts = [];

  if (query.page !== undefined) {
    parts.push(`page:${query.page}`);
  }

  if (query.limit !== undefined) {
    parts.push(`limit:${query.limit}`);
  }

  if (query.search) {
    parts.push(`search:${query.search}`);
  }

  if (query.status) {
    parts.push(`status:${query.status}`);
  }

  if (query.sortBy) {
    parts.push(`sort:${query.sortBy}`);
  }

  if (query.sortOrder) {
    parts.push(`order:${query.sortOrder}`);
  }

  return parts.join(':');
};
