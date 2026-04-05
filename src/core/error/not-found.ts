import { HttpStatus } from '@/shared/constants';
import { ApiError } from '@/shared/utils';

export const notFoundError = (
  resource = 'Resource',
  identifier?: string,
  value?: string
): ApiError => {
  let message = `${resource} not found`;

  if (identifier && value) message += ` with ${identifier}: ${value}`;
  else if (identifier) message += ` by ${identifier}`;

  return new ApiError(message, HttpStatus.NOT_FOUND);
};
