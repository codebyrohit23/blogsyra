import { AccountStatus, Gender } from '@/shared/constants';
import { Types } from 'mongoose';

interface UserBase {
  name?: string;
  gender?: Gender;
  bio?: string;
  dob?: Date;
  avatar?: Types.ObjectId;
  coverImage?: Types.ObjectId;
  status?: AccountStatus;
}

export type CreateUserInput = Omit<UserBase, 'status'>;
export type UpdateUserInput = Partial<UserBase>;
