// import { buildKey } from '@/core/cache';
// import { SessionPaginationRequest } from './schemas';

// export const SESSION_REDIS_KEYS = {
//   sessionById: (id: string) => buildKey('session', id),

//   sessionBySessionId: (sessionId: string) => buildKey('session', 'sid', sessionId),

//   sessionsList: (query: SessionPaginationRequest) =>
//     buildKey(
//       'sessions',
//       `page:${query.page}`,
//       `limit:${query.limit}`,
//       `status:${query.status}`,
//       `sort:${query.sortBy}`,
//       `order:${query.sortOrder}`
//     ),

//   patterns: {
//     sessionById: () => buildKey('session', '*'),
//     sessionBySessionId: () => buildKey('session', 'sid', '*'),
//     sessionsList: () => buildKey('sessions', '*'),
//     all: () => 'session*',
//   },
// };
