import { Role } from '@/shared/constants';
import { MongoId } from '@/shared/types';

export enum EmailQueues {
  OTP = 'send-otp-email',
  WELCOME = 'send-welcome-email',
}
export interface EmailPayload {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

export interface EmailJob {
  id: MongoId;
  role: Role;
}
