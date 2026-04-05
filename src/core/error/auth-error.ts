import { HttpStatus } from '@/shared/constants';
import { ApiError } from '@/shared/utils';

export const jwtExpiredError = (): ApiError =>
  new ApiError('Token has been expired', HttpStatus.UNAUTHORIZED);

export const jwtInvalidError = (): ApiError =>
  new ApiError('Invalid token.', HttpStatus.UNAUTHORIZED);

export const missingTokenError = () =>
  new ApiError('Authentication token is missing!', HttpStatus.UNAUTHORIZED);

export const forbiddenError = (): ApiError =>
  new ApiError('You do not have permission to perform this action.', HttpStatus.FORBIDDEN);

export const invalidCredentialError = (): ApiError =>
  new ApiError('Invalid credentials.', HttpStatus.UNAUTHORIZED);

export const alreadyExistsError = (entity: string, field: string): ApiError =>
  new ApiError(`${entity} already exists with this ${field}.`, HttpStatus.CONFLICT);
