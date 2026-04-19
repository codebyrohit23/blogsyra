// import { buildKey } from '@/infra/cache';
// import { TemplatePaginationDto } from './schemas';

// export const TEMPLATE_REDIS_KEYS = {
//   templateById: (id: string) => buildKey('template', id),

//   templatesList: (query: TemplatePaginationDto) =>
//     buildKey(
//       'templates',
//       `page:${query.page}`,
//       `limit:${query.limit}`,
//       `search:${query.search ?? 'none'}`,
//       `status:${query.status}`,
//       `sort:${query.sortBy}`,
//       `order:${query.sortOrder}`
//     ),

//   patterns: {
//     templateById: () => buildKey('template', '*'),
//     templatesList: () => buildKey('templates', '*'),
//     all: () => buildKey('template*'),
//   },
// };
