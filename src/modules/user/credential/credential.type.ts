import { Types } from 'mongoose';

interface CredentialBase {
  userId: Types.ObjectId;
  password: string;
}

export type CreateCredentialInput = CredentialBase;

export type UpdateCredentialInput = Omit<CredentialBase, 'userId'>;
