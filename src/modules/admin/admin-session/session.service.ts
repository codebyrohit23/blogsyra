// import { PaginationResult } from '@/core/db/toolkit';
// import { SessionPaginationRequest } from './schemas';
// import { notFoundError } from '@/core/error';
// import { CacheService } from '@/core/cache';
// import { SortOrder } from '@/shared/constants';
// import { SessionDocument, SessionLean } from './session.model';
// import { SessionRepository } from './session.repository';
// import { SESSION_REDIS_KEYS } from './session.redis-keys';
// import { CreateSessionPayload } from './session.type';

// export class SessionService {
//   constructor(
//     private readonly repo: SessionRepository,
//     private readonly cache: CacheService
//   ) {}

//   public async getSessions(
//     query: SessionPaginationRequest
//   ): Promise<PaginationResult<SessionLean>> {
//     const redisKey = SESSION_REDIS_KEYS.sessionsList(query);

//     const cached = await this.cache.get<PaginationResult<SessionLean>>(redisKey);
//     if (cached) return cached;

//     const { page, limit, status, sortBy, sortOrder } = query;

//     const filter: Record<string, any> = {};

//     if (status) {
//       filter.status = status;
//     }

//     const sort: Record<string, 1 | -1> = {
//       [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
//     };

//     const result = await this.repo.paginate({
//       filter,
//       sort,
//       page,
//       limit,
//     });

//     if (result) {
//       await this.cache.set(redisKey, result);
//     }

//     return result;
//   }

//   public async createLoginSession(payload: CreateSessionPayload): Promise<SessionDocument | null> {
//     const { adminId, deviceId } = payload;

//     const filter = { adminId, deviceId };

//     const lastActiveAt = new Date();

//     let session = await this.repo.findOne({ filter });

//     if (!session) {
//       const loggedInAt = new Date();

//       session = await this.repo.create({ ...payload, lastActiveAt, loggedInAt });
//     } else {
//       session = await this.repo.updateOne(
//         filter,
//         { ...payload, lastActiveAt },
//         { returnDocument: 'after' }
//       );
//     }

//     if (!session) {
//       throw new Error('Failed to create or update login session');
//     }

//     const sessionByIdRedisKey = SESSION_REDIS_KEYS.sessionById(session?._id.toString());
//     const sessionBySessionIdRredisKey = SESSION_REDIS_KEYS.sessionBySessionId(session.sessionId);
//     const sessionListRedisKey = SESSION_REDIS_KEYS.patterns.sessionsList();

//     await Promise.all([
//       this.cache.set(sessionByIdRedisKey, session),
//       this.cache.set(sessionBySessionIdRredisKey, session),
//       this.cache.deleteByPattern(sessionListRedisKey),
//     ]);

//     return session;
//   }

//   public async getSessionBySessionId(sessionId: string): Promise<SessionLean> {
//     const redisKey = SESSION_REDIS_KEYS.sessionBySessionId(sessionId);

//     const cached = await this.cache.get<SessionLean>(redisKey);

//     if (cached) return cached;

//     const session = await this.repo.findOne({ filter: { sessionId } });

//     if (!session) throw notFoundError('Session');

//     await this.cache.set(redisKey, session);

//     return session;
//   }

//   public async getSessionById(id: string): Promise<SessionLean> {
//     const redisKey = SESSION_REDIS_KEYS.sessionById(id);

//     const cached = await this.cache.get<SessionLean>(redisKey);

//     if (cached) return cached;

//     const session = await this.repo.findById(id);

//     if (!session) throw notFoundError('Session');

//     await this.cache.set(redisKey, session);

//     return session;
//   }

//   //   public async updateSession(payload: UpdateSessionRequest, id: string): Promise<SessionLean> {
//   //     const session = await this.repo.updateOne({ _id: id }, payload);

//   //     if (!session) throw notFoundError('Session');

//   //     const redisPattern = SESSION_REDIS_KEYS.patterns.all();

//   //     await this.cache.deleteByPattern(redisPattern);

//   //     return session;
//   //   }

//   public async deleteSessionById(id: string) {
//     const session = await this.repo.deleteById(id);

//     if (!session) throw notFoundError('Session');

//     const redisPattern = SESSION_REDIS_KEYS.patterns.all();

//     await this.cache.deleteByPattern(redisPattern);

//     return session;
//   }

//   private async exists(filter: object): Promise<boolean> {
//     return this.repo.exists(filter);
//   }
// }
