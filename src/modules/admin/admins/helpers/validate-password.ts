import { invalidCredentialError } from '@/core/error';
import { comparePassword } from '@/shared/utils';

export const validatePassword = (inputPassword: string, dbPassword: string) => {
  if (!comparePassword(inputPassword, dbPassword)) {
    throw invalidCredentialError();
  }
};
