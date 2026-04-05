import { CacheService } from '@/core/cache';
import { IdentityRepository } from './identity.repository';
import { CreateIdentityInput, UpdateIdentityInput } from './identity.type';
import { IdentityDocument, IdentityLean } from './identity.model';
import { ApiError } from '@/shared/utils';
import { notFoundError } from '@/core/error';
import { ClientSession, Types } from 'mongoose';

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

      if (exists) {
        throw new ApiError('User already exist for this email.');
      }
    }
    const identity = await this.repo.create(payload, session);
    return identity;
  }

  public async getIdentityByEmail(email: string): Promise<IdentityLean | null> {
    const identity = await this.repo.findOne({ filter: { email } });

    return identity;
  }

  public async getIdentityByUserId(userId: Types.ObjectId): Promise<IdentityLean | null> {
    const identity = await this.repo.findOne({
      filter: { userId },
      projection: { email: 1, emailVerified: 1 },
    });

    return identity;
  }

  public async updateIdentity(
    userId: Types.ObjectId,
    payload: UpdateIdentityInput
  ): Promise<IdentityLean | null> {
    const identity = await this.repo.updateOne({ userId }, payload);

    return identity;
  }

  public async deleteIdentity(id: string) {
    const identity = await this.repo.deleteById(id);

    if (!identity) throw notFoundError('Identity');

    return identity;
  }
}
