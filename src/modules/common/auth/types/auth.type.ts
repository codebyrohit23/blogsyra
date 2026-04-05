import { Platform, Role } from '@/shared/constants';
import { Types } from 'mongoose';
import { SessionLean } from '../models';
import { AuthTokenPairResponse } from './jwt.type';

export interface CreateSessionAndIssueTokensPayload {
  id: Types.ObjectId;
  role: Role;

  platform: Platform;
  deviceId: string;
  fcmToken: string;

  timezone: string;
  ip?: string;
  location?: string;
}

export interface CreateSessionAndIssueTokensResponse {
  session: SessionLean;
  token: AuthTokenPairResponse;
}
