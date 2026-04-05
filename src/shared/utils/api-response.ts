import { Response } from 'express';
import { ApiResponse, SendResponsePayload } from '@/shared/types';

export const sendResponse = <T>(
  res: Response<ApiResponse<T>>,
  payload: Omit<SendResponsePayload<T>, 'res'>
): Response<ApiResponse<T>> => {
  const {
    statusCode = 200,
    message = 'success',
    data,
    errors,
    pagination,
    stack,
    status,
  } = payload;

  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    ...(message && { message }),
    ...(data !== undefined && { data }),
    ...(errors && { errors }),
    ...(pagination && { pagination }),
    ...(stack && { stack }),
    ...(status && { status }),
  };

  return res.status(statusCode).json(response);
};

import { SuccessResponse, SendSuccessPayload } from '@/shared/types';

export const sendSuccess = <T>(
  res: Response<SuccessResponse<T>>,
  payload: SendSuccessPayload<T>
): Response<SuccessResponse<T>> => {
  const { statusCode = HttpStatus.OK, message = 'Success', data, pagination } = payload;

  const response: SuccessResponse<T> = {
    success: true,
    message,
    data: data ?? null, // ensures type consistency
    ...(pagination && { pagination }),
  };

  return res.status(statusCode).json(response);
};

import { ErrorResponse, SendErrorPayload } from '@/shared/types';
import { HttpStatus } from '../constants';

export const sendError = (
  res: Response<ErrorResponse>,
  payload: SendErrorPayload
): Response<ErrorResponse> => {
  const {
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    message,
    errors,
    status = 'ERROR',
    stack,
  } = payload;

  const response: ErrorResponse = {
    success: false,
    message,
    status,
    ...(errors !== undefined && { errors }),
    ...(stack && { stack }),
  };

  return res.status(statusCode).json(response);
};
