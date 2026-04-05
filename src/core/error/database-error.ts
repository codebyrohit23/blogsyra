import { ApiError } from '@/shared/utils';
import { MongoDuplicateKeyError, MongooseCastError, MongooseValidationError } from './types';
import { HttpStatus } from '@/shared/constants';

export const castError = (err: MongooseCastError): ApiError => {
  const msg = `Invalid value for ${err?.path}: ${err?.value}`;
  return new ApiError(msg, HttpStatus.BAD_REQUEST);
};

export const duplicateKeyError = (err: MongoDuplicateKeyError): ApiError => {
  const msg = `Duplicate field value: ${JSON.stringify(err?.keyValue)}. Please use another value!`;
  return new ApiError(msg, HttpStatus.BAD_REQUEST);
};

export const validationError = (err: MongooseValidationError): ApiError => {
  const errors = Object.values(err.errors).map((e) => e.message);
  const msg = `Invalid input data: ${errors.join('. ')}`;
  return new ApiError(msg, HttpStatus.BAD_REQUEST);
};
