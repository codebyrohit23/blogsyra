import { buildKey } from '@/core/cache';

export const USER_REDIS_KEYS = {
  userById: (id: string) => buildKey('user', id),
  userByUserName: (name: string) => buildKey('user', 'username', name),

  //   usersList: (query: TemplatePaginationRequest) =>
  //     buildKey(
  //       'users',
  //       `page:${query.page}`,
  //       `limit:${query.limit}`,
  //       `search:${query.search ?? 'none'}`,
  //       `status:${query.status}`,
  //       `sort:${query.sortBy}`,
  //       `order:${query.sortOrder}`
  //     ),

  patterns: {
    userById: () => buildKey('user', '*'),
    userByUserName: () => buildKey('user', 'username', '*'),
    usersList: () => buildKey('users', '*'),
    all: () => buildKey('user*'),
  },
};
