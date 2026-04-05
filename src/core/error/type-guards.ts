import { ApiError } from '@/shared/utils';
import {
  MongooseCastError,
  MongooseValidationError,
  MongoDuplicateKeyError,
  JWTExpiredError,
  JWTInvalidError,
  ZodValidationError,
} from './types';

/**
 * Type guard for ApiError
 */
export function isApiError(error: Error): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard for Mongoose CastError
 */
export function isCastError(error: Error): error is MongooseCastError {
  return error.name === 'CastError' && 'path' in error && 'value' in error;
}

/**
 * Type guard for MongoDB Duplicate Key Error
 */
export function isDuplicateKeyError(error: Error): error is MongoDuplicateKeyError {
  return 'code' in error && (error as MongoDuplicateKeyError).code === 11000;
}

/**
 * Type guard for Mongoose ValidationError
 */
export function isValidationError(error: Error): error is MongooseValidationError {
  return error.name === 'ValidationError' && 'errors' in error;
}

/**
 * Type guard for JWT Expired Error
 */
export function isJWTExpiredError(error: Error): error is JWTExpiredError {
  return error.name === 'TokenExpiredError';
}

/**
 * Type guard for JWT Invalid Error
 */
export function isJWTInvalidError(error: Error): error is JWTInvalidError {
  return error.name === 'JsonWebTokenError';
}

/**
 * Type guard for Zod Validation Error
 */
export function isZodError(error: Error): error is ZodValidationError {
  return error.name === 'ZodError' && 'issues' in error;
}
