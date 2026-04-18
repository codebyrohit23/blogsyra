// import { buildKey } from '@/infra/cache';
// import { AdminPaginationDto } from './schemas';

// export const ADMIN_REDIS_KEYS = {
//   adminById: (id: string) => buildKey('admin', id),

//   adminByEmail: (email: string) => buildKey('admin', 'email', email),

//   adminsList: (query: AdminPaginationDto) =>
//     buildKey(
//       'admins',
//       `page:${query.page}`,
//       `limit:${query.limit}`,
//       `search:${query.search ?? 'none'}`,
//       `status:${query.status}`,
//       `sort:${query.sortBy}`,
//       `order:${query.sortOrder}`
//     ),

//   patterns: {
//     adminById: () => buildKey('admin', '*'),
//     adminByEmail: () => buildKey('admin', 'email', '*'),
//     adminsList: () => buildKey('admins', '*'),
//     all: () => 'admin*',
//   },
// };
