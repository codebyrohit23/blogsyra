import { castError, duplicateKeyError, validationError } from './database-error.js';
import { jwtExpiredError, jwtInvalidError } from './auth-error.js';
import { zodError } from './validation-error.js';
import {
  isCastError,
  isDuplicateKeyError,
  isValidationError,
  isJWTExpiredError,
  isJWTInvalidError,
  isZodError,
  isApiError,
} from './type-guards.js';
import { HttpStatus } from '@/shared/constants';
import { ApiError } from '@/shared/utils';

// import { isAppError } from '@/common/errors/typeGuards.js';

/**
 * Converts Error to AppError using type guards
 * This is fully type-safe without any or unknown
 */
export const errorConverter = (err: Error): ApiError => {
  // Already an AppError, return as is
  if (isApiError(err)) {
    return err;
  }

  // MongoDB CastError (invalid ObjectId, etc.)
  if (isCastError(err)) {
    return castError(err);
  }

  // MongoDB duplicate key error
  if (isDuplicateKeyError(err)) {
    return duplicateKeyError(err);
  }

  // Mongoose validation error
  if (isValidationError(err)) {
    return validationError(err);
  }

  // JWT expired error
  if (isJWTExpiredError(err)) {
    return jwtExpiredError();
  }

  // JWT invalid error
  if (isJWTInvalidError(err)) {
    return jwtInvalidError();
  }

  // Zod validation error
  if (isZodError(err)) {
    return zodError(err);
  }

  return new ApiError(
    err.message || 'An unexpected error occurred',
    HttpStatus.INTERNAL_SERVER_ERROR
  );
};
