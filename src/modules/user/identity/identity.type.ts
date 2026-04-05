import { EntityStatus, Gender } from '@/shared/constants';
import { Types } from 'mongoose';

interface IdentityBase {
  userId: Types.ObjectId;
  email?: string;
  emailVerified?: boolean;
  status?: EntityStatus;
}

export type CreateIdentityInput = IdentityBase;

export type UpdateIdentityInput = Omit<IdentityBase, 'userId'>;
