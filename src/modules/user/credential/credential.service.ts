import { CacheService } from '@/core/cache';
import { CredentialRepository } from './credential.repository';
import { CreateCredentialInput, UpdateCredentialInput } from './credential.type';
import { CredentialDocument, CredentialLean } from './credential.model';
import { ApiError } from '@/shared/utils';
import { notFoundError } from '@/core/error';
import { ClientSession, Types } from 'mongoose';

export class CredentialService {
  constructor(
    private readonly repo: CredentialRepository,
    private readonly cache: CacheService
  ) {}

  public async createCredential(
    payload: CreateCredentialInput,
    session: ClientSession
  ): Promise<CredentialDocument> {
    const { userId } = payload;

    if (userId) {
      const exists = await this.repo.exists({ userId });

      if (exists) {
        throw new ApiError('Credential already exist for this user.');
      }
    }
    const credential = await this.repo.create(payload, session);
    return credential;
  }

  public async getCredentialByUserId(userId: Types.ObjectId): Promise<CredentialLean> {
    const credential = await this.repo.findOne({ filter: { userId } });

    if (!credential) throw notFoundError('Credential');

    return credential;
  }

  public async updateCredentialByUserId(
    userId: Types.ObjectId,
    payload: UpdateCredentialInput
  ): Promise<CredentialLean | null> {
    const credential = await this.repo.updateOne({ userId }, payload);

    return credential;
  }

  public async deleteCredentialByUserId(userId: Types.ObjectId) {
    return this.repo.deleteOne({ userId });
  }
}
