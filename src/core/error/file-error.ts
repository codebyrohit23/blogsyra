import { HttpStatus } from '@/shared/constants';
import { ApiError } from '@/shared/utils';

export const fileTypeError = (): ApiError =>
  new ApiError('Invalid file type. Please upload a valid file.', HttpStatus.BAD_REQUEST);

export const fileSizeError = () => new ApiError('File size is too large.', HttpStatus.BAD_REQUEST);
