import { Request, Response, NextFunction } from 'express';
import { Environment, HttpStatus } from '@/shared/constants';
import { logger } from '@/core/logger';
import { ApiError, sendError } from '@/shared/utils';
import { errorConverter } from '@/core/error';
import { config } from '@/core/config';
import { ErrorResponse } from '@/shared/types';

// const sendErrorDev = (error: ApiError, res: Response): Response => {
//   return sendResponse(res, {
//     statusCode: error.statusCode,
//     status: error.status,
//     message: error.message,
//     stack: error.stack,
//   });
// };

// const sendErrorProd = (error: ApiError, res: Response): Response => {
//   if (error.isOperational) {
//     return sendResponse(res, {
//       statusCode: error.statusCode,
//       status: error.status,
//       message: error.message,
//     });
//   }
//   return sendResponse(res, {
//     statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//     status: 'error',
//     message: 'Something went wrong. Please try again later.',
//   });
// };

const sendErrorDev = (error: ApiError, res: Response): Response<ErrorResponse> => {
  return sendError(res, {
    statusCode: error.statusCode,
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error: ApiError, res: Response): Response => {
  if (error.isOperational) {
    return sendError(res, {
      statusCode: error.statusCode,
      status: error.status,
      message: error.message,
    });
  }
  return sendError(res, {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    status: 'error',
    message: 'Something went wrong. Please try again later.',
  });
};

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err.message);
  const error = errorConverter(err);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (config.app.nodeEnv === Environment.DEVELOPEMENT) return sendErrorDev(error, res);

  sendErrorProd(error, res);
};
