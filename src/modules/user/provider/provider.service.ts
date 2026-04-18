import { ProviderRepository } from './provider.repository';
import { CreateProviderInput } from './provider.type';
import { ProviderDocument, ProviderLean } from './provider.model';
import { ApiError } from '@/shared/utils';
import { ClientSession } from 'mongoose';
import { AuthProvider } from '@/shared/constants';

export class ProviderService {
  constructor(private readonly repo: ProviderRepository) {}

  public async createProvider(
    payload: CreateProviderInput,
    session?: ClientSession
  ): Promise<ProviderDocument> {
    const { userId } = payload;

    const exists = await this.repo.exists({ userId });

    if (exists) throw new ApiError('AuthProvider already exist for this user.');

    const provider = await this.repo.create(payload, session);

    return provider;
  }

  public async getProvider(
    provider: AuthProvider,
    providerId: string
  ): Promise<ProviderLean | null> {
    return this.repo.findOne({
      filter: { provider, providerId },
      projection: { provider: 1, providerId: 1, userId: 1 },
    });
  }
}
