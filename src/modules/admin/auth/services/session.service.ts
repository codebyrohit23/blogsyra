// import { PaginationResult } from '@/core/db/toolkit';
// import { SessionPaginationDto } from '../schemas';
// import { convertToObjectId } from '@/shared/utils';
// import { notFoundError } from '@/core/error';
// import { CacheService } from '@/core/cache';
// import { SortOrder } from '@/shared/constants';
// import { SessionDocument, SessionLean } from '../models';
// import { SessionRepository } from '../repositories';
// import { SESSION_REDIS_KEYS } from '../redis-keys';

// export class SessionService {
//   constructor(
//     private readonly repo: SessionRepository,
//     private readonly cache: CacheService
//   ) {}

//   public async getSessions(query: SessionPaginationDto): Promise<PaginationResult<SessionLean>> {
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

//   public async createSession(payload: CreateSessionRequest, id: string): Promise<SessionDocument> {
//     const createdBy = convertToObjectId(id);

//     const template = await this.repo.create({ ...payload, createdBy });

//     const redisKey = SESSION_REDIS_KEYS.patterns.templatesList();

//     await this.cache.deleteByPattern(redisKey);

//     return template;
//   }

//   public async getSession(id: string): Promise<SessionLean> {
//     const redisKey = SESSION_REDIS_KEYS.templateById(id);

//     const cached = await this.cache.get<SessionLean>(redisKey);

//     if (cached) return cached;

//     const template = await this.repo.findById(id);

//     if (!template) throw notFoundError('Session');

//     await this.cache.set(redisKey, template);

//     return template;
//   }

//   public async updateSession(payload: UpdateSessionRequest, id: string): Promise<SessionLean> {
//     const template = await this.repo.updateOne({ _id: id }, payload);

//     if (!template) throw notFoundError('Session');

//     const redisPattern = SESSION_REDIS_KEYS.patterns.all();

//     await this.cache.deleteByPattern(redisPattern);

//     return template;
//   }

//   public async deleteSession(id: string) {
//     const template = await this.repo.deleteById(id);

//     if (!template) throw notFoundError('Session');

//     const redisPattern = SESSION_REDIS_KEYS.patterns.all();

//     await this.cache.deleteByPattern(redisPattern);

//     return template;
//   }

//   private async exists(filter: object): Promise<boolean> {
//     return this.repo.exists(filter);
//   }
// }
