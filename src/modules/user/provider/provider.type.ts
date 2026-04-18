import { AuthProvider } from '@/shared/constants';
import { MongoId } from '@/shared/types';

interface ProviderBase {
  userId: MongoId;
  providerId: string;
  provider: AuthProvider;
}

export type CreateProviderInput = ProviderBase;
