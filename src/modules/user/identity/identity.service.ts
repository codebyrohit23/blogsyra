import { CacheService } from '@/infra/cache';
import { IdentityRepository } from './identity.repository';
import { CreateIdentityInput, UpdateIdentityInput } from './identity.type';
import { IdentityDocument, IdentityLean } from './identity.model';
import { ApiError } from '@/shared/utils';
import { notFoundError } from '@/core/error';
import { ClientSession } from 'mongoose';
import { IdentityCacheKeys } from './identity.cache';
import { MongoId } from '@/shared/types';

export class IdentityService {
  constructor(
    private readonly repo: IdentityRepository,
    private readonly cache: CacheService
  ) {}

  public async createUserIdentity(
    payload: CreateIdentityInput,
    session: ClientSession
  ): Promise<IdentityDocument> {
    const { email } = payload;

    if (email) {
      const exists = await this.repo.exists({ email });

      if (exists) throw new ApiError('User already exist for this email.');
    }

    const identity = await this.repo.create(payload, session);
    return identity;
  }

  public async getIdentityByEmail(email: string): Promise<IdentityLean | null> {
    const cached = await this.cache.get<IdentityLean>(IdentityCacheKeys.byEmail(email));

    if (cached) return cached;

    const identity = await this.repo.findOne({ filter: { email } });

    if (identity) await this.cache.set(IdentityCacheKeys.byEmail(email), identity);

    return identity;
  }

  public async getIdentityByUserId(userId: MongoId): Promise<IdentityLean | null> {
    const cached = await this.cache.get<IdentityLean>(IdentityCacheKeys.byUserId(userId));

    if (cached) return cached;

    const identity = await this.repo.findOne({
      filter: { userId },
      projection: { email: 1, emailVerified: 1 },
    });

    if (identity) {
      await this.cache.set(IdentityCacheKeys.byUserId(userId), identity);
    }

    return identity;
  }

  public async updateIdentity(
    userId: MongoId,
    payload: UpdateIdentityInput
  ): Promise<IdentityLean | null> {
    const identity = await this.repo.updateOne({ userId }, payload);

    await Promise.all([
      this.cache.del(IdentityCacheKeys.byUserId(userId)),
      identity?.email && this.cache.del(IdentityCacheKeys.byEmail(identity?.email)),
    ]);
    return identity;
  }

  public async deleteIdentityByUserId(userId: MongoId) {
    const identity = await this.repo.deleteOne({ userId });

    if (!identity) throw notFoundError('Identity');

    await Promise.all([
      this.cache.del(IdentityCacheKeys.byUserId(userId)),
      identity.email && this.cache.del(IdentityCacheKeys.byEmail(identity.email)),
    ]);

    return identity;
  }
}
