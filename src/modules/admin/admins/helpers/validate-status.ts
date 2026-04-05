import { AccountStatus, HttpStatus } from '@/shared/constants';
import { ApiError } from '@/shared/utils';

export const validateAccountStatus = (status: AccountStatus) => {
  switch (status) {
    case AccountStatus.INACTIVE:
      throw new ApiError('Account is deactivated', HttpStatus.FORBIDDEN);

    case AccountStatus.DELETED:
      throw new ApiError('Account has been deleted', HttpStatus.FORBIDDEN);

    case AccountStatus.BLOCKED:
      throw new ApiError('Account is blocked. Contact administrator', HttpStatus.FORBIDDEN);
  }
};
