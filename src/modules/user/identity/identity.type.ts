import { EntityStatus } from '@/shared/constants';
import { MongoId } from '@/shared/types';

interface IdentityBase {
  userId: MongoId;
  email?: string;
  emailVerified?: boolean;
  status?: EntityStatus;
}

export type CreateIdentityInput = IdentityBase;

export type UpdateIdentityInput = Omit<IdentityBase, 'userId'>;
