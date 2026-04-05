import { ApiError } from '@/shared/utils';
import { ZodValidationError } from './types';
import { HttpStatus } from '@/shared/constants';

export const zodError = (err: ZodValidationError): ApiError => {
  const errors = err.issues.map((issue) => {
    const path = issue.path.join('.');
    // return `${issue.message}`;
    return `${path} ${issue.message}`;
  });

  // const message = `Validation failed. ${errors.join(', ')}`;
  const message = `${errors.join(', ')}`;
  return new ApiError(message, HttpStatus.BAD_REQUEST);
};
