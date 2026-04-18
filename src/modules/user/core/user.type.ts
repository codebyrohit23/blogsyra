import { AccountStatus, Gender } from '@/shared/constants';
interface UserBase {
  name?: string;
  gender?: Gender;
  bio?: string;
  dob?: Date;
  avatar?: string;
  coverImage?: string;
  status?: AccountStatus;
}

export type CreateUserInput = Omit<UserBase, 'status'>;
export type UpdateUserInput = Partial<UserBase>;
