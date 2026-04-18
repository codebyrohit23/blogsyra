import { MongoId } from '@/shared/types';

interface CredentialBase {
  userId: MongoId;
  password: string;
}

export type CreateCredentialInput = CredentialBase;

export type UpdateCredentialInput = Omit<CredentialBase, 'userId'>;
