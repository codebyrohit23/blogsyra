import { Types } from 'mongoose';
import { AccountStatus } from '@/shared/constants';

/* 
  Admin Input 
*/
export interface AdminBase {
  name: string;
  email: string;
  password: string;

  passwordChangedAt?: Date;
  roleId?: Types.ObjectId;
  avatar?: Types.ObjectId;

  timezone?: string;
  language?: string;
  status?: AccountStatus;

  notes?: string;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export type CreateAdminInput = Omit<AdminBase, 'updatedBy'>;

export type UpdateAdminInput = Partial<Omit<AdminBase, 'createdBy'>>;

// export interface LoginResponse {
//   admin: Partial<AdminDocument>;
//   tokensResponse: AuthTokenPairResponse;
// }

// interface AuthTokenResponse {
//   access: TokenResult;
// }

// export interface AuthResponse {
//   admin: Partial<AdminDocument>;
//   token: AuthTokenResponse;
// }
