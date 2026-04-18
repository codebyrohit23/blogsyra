import { notFoundError } from '@/core/error';
import { CacheService } from '@/infra/cache';
import { SessionRepository } from '../repositories';
import { SessionDocument, SessionLean } from '../models';
import { CreateSessionInput, SessionStatus } from '../types';
import { AUTH_REDIS_KEYS } from '../utils/redis-keys';

export class SessionService {
  constructor(
    private readonly repo: SessionRepository,
    private readonly cache: CacheService
  ) {}

  //   public async getSessions(
  //     query: SessionPaginationRequest
  //   ): Promise<PaginationResult<SessionLean>> {
  //     const redisKey = AUTH_REDIS_KEYS.session.sessionsList(query);

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

  public async createSession(payload: CreateSessionInput): Promise<SessionDocument> {
    const { refId, deviceId } = payload;

    const filter = { refId, deviceId };

    const lastActiveAt = new Date();

    let session = await this.repo.findOne({ filter });

    if (!session) {
      const loggedInAt = new Date();

      session = await this.repo.create({ ...payload, lastActiveAt, loggedInAt });
    } else {
      session = await this.repo.updateOne(filter, { ...payload, lastActiveAt });
    }

    if (!session) {
      throw new Error('Failed to create or update login session');
    }

    const sessionByIdRedisKey = AUTH_REDIS_KEYS.session.sessionById(session?._id.toString());
    const sessionBySessionIdRredisKey = AUTH_REDIS_KEYS.session.sessionBySessionId(
      session.sessionId
    );
    const sessionListRedisKey = AUTH_REDIS_KEYS.session.patterns.sessionsList();

    await Promise.all([
      this.cache.set(sessionByIdRedisKey, session),
      this.cache.set(sessionBySessionIdRredisKey, session),
      this.cache.deleteByPattern(sessionListRedisKey),
    ]);

    return session;
  }

  public async logout(sessionId: string) {
    const redisKey = AUTH_REDIS_KEYS.session.sessionBySessionId(sessionId);

    return Promise.all([
      this.repo.updateOne({ sessionId: sessionId }, { status: SessionStatus.LOGGED_OUT }),
      this.cache.del(redisKey),
    ]);
  }

  private async getSessionBySessionId(sessionId: string): Promise<SessionLean> {
    const redisKey = AUTH_REDIS_KEYS.session.sessionBySessionId(sessionId);

    const cached = await this.cache.get<SessionLean>(redisKey);

    if (cached) return cached;

    const session = await this.repo.findOne({ filter: { sessionId } });

    if (!session) throw notFoundError('Session');

    await this.cache.set(redisKey, session);

    return session;
  }

  private async getSessionById(id: string): Promise<SessionLean> {
    const redisKey = AUTH_REDIS_KEYS.session.sessionById(id);

    const cached = await this.cache.get<SessionLean>(redisKey);

    if (cached) return cached;

    const session = await this.repo.findById(id);

    if (!session) throw notFoundError('Session');

    await this.cache.set(redisKey, session);

    return session;
  }

  private async updateSession(payload: any, id: string): Promise<SessionLean> {
    const session = await this.repo.updateOne({ _id: id }, payload);

    if (!session) throw notFoundError('Session');

    const redisPattern = AUTH_REDIS_KEYS.session.patterns.all();

    await this.cache.deleteByPattern(redisPattern);

    return session;
  }

  private async deleteSessionById(id: string) {
    const session = await this.repo.deleteById(id);

    if (!session) throw notFoundError('Session');

    const redisPattern = AUTH_REDIS_KEYS.session.patterns.all();

    await this.cache.deleteByPattern(redisPattern);

    return session;
  }

  private async exists(filter: object): Promise<boolean> {
    return this.repo.exists(filter);
  }
}
