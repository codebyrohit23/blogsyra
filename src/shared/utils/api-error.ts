import { HttpStatus } from '@/shared/constants';

export class ApiError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    isOperational: boolean = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
