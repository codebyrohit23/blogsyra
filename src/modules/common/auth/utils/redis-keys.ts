import { buildKey } from '@/core/cache';

export const AUTH_REDIS_KEYS = {
  session: {
    sessionById: (id: string) => buildKey('auth', 'session', id),

    sessionBySessionId: (sessionId: string) => buildKey('session', 'sid', sessionId),

    // sessionsList: (query: SessionPaginationRequest) =>
    //   buildKey(
    // 'auth',
    //     'sessions',
    //     `page:${query.page}`,
    //     `limit:${query.limit}`,
    //     `status:${query.status}`,
    //     `sort:${query.sortBy}`,
    //     `order:${query.sortOrder}`
    //   ),

    patterns: {
      sessionById: () => buildKey('auth', 'session', '*'),
      sessionBySessionId: () => buildKey('auth', 'session', 'sid', '*'),
      sessionsList: () => buildKey('auth', 'sessions', '*'),
      all: () => buildKey('auth', 'session*'),
    },
  },

  token: {
    blackList: (jti: string) => buildKey('auth', 'blacklist', 'jti', jti),
  },
};

// export const SESSION_REDIS_KEYS = {
//   sessionById: (id: string) => buildKey('session', id),

//   sessionBySessionId: (sessionId: string) => buildKey('session', 'sid', sessionId),

//   // sessionsList: (query: SessionPaginationRequest) =>
//   //   buildKey(
//   //     'sessions',
//   //     `page:${query.page}`,
//   //     `limit:${query.limit}`,
//   //     `status:${query.status}`,
//   //     `sort:${query.sortBy}`,
//   //     `order:${query.sortOrder}`
//   //   ),

//   patterns: {
//     sessionById: () => buildKey('session', '*'),
//     sessionBySessionId: () => buildKey('session', 'sid', '*'),
//     sessionsList: () => buildKey('sessions', '*'),
//     all: () => 'session*',
//   },
// };

// export const TOKEN_REDIS_KEYS = {
//   tokenById: (id: string) => buildKey('token', id),

//   tokenByJti: (jti: string) => buildKey('token', 'jti', jti),

//   //tokensList: (query: SessionPaginationRequest) =>
//   //   buildKey(
//   //     'sessions',
//   //     `page:${query.page}`,
//   //     `limit:${query.limit}`,
//   //     `status:${query.status}`,
//   //     `sort:${query.sortBy}`,
//   //     `order:${query.sortOrder}`
//   //   ),

//   patterns: {
//     tokenById: () => buildKey('session', '*'),
//     tokenBySessionId: () => buildKey('session', 'sid', '*'),
//     tokensList: () => buildKey('sessions', '*'),
//     all: () => 'session*',
//   },
// };
