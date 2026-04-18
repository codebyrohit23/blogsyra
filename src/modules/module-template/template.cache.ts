import { buildKey, CacheVersionService } from '@/infra/cache';
import { MongoId } from '@/shared/types';
import { toStringId } from '@/shared/utils';
import { TemplatePaginationDto } from './schemas';

export const TemplateCacheKeys = {
  byId: (id: MongoId) => buildKey('template', toStringId(id)),

  list: (queryKey: string, version: number) => buildKey('templates', `v${version}`, queryKey),
};

export const TEMPLATE_CACHE_VERSION_KEYS = {
  LIST: 'templates:list:version',
};

export class TemplateCacheVersion {
  constructor(private readonly version: CacheVersionService) {}

  async getListVersion() {
    return this.version.get(TEMPLATE_CACHE_VERSION_KEYS.LIST);
  }

  async bumpListVersion() {
    return this.version.bump(TEMPLATE_CACHE_VERSION_KEYS.LIST);
  }
}

export const buildQueryKey = (query: TemplatePaginationDto) => {
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
