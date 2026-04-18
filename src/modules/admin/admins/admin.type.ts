import { AccountStatus } from '@/shared/constants';
import { MongoId } from '@/shared/types';

/* 
  Admin Input 
*/
export interface AdminBase {
  name: string;
  email: string;
  password: string;

  passwordChangedAt?: Date;
  roleId?: string;
  avatar?: string;

  timezone?: string;
  language?: string;
  status?: AccountStatus;

  notes?: string;

  createdBy?: MongoId;
  updatedBy?: MongoId;
}

export type CreateAdminInput = Omit<AdminBase, 'updatedBy'>;

export type UpdateAdminInput = Partial<Omit<AdminBase, 'createdBy'>>;
