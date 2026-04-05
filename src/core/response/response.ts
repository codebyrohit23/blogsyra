// import { ApiResponse, SendResponsePayload } from './types';

// import { Response } from 'express';

// export const sendResponse = <T>(
//   res: Response<ApiResponse<T>>,
//   payload: Omit<SendResponsePayload<T>, 'res'>
// ): Response<ApiResponse<T>> => {
//   const { statusCode = 200, message, data, errors, pagination, stack, status } = payload;

//   const response: ApiResponse<T> = {
//     success: statusCode >= 200 && statusCode < 300,
//     ...(message && { message }),
//     ...(data !== undefined && { data }),
//     ...(errors && { errors }),
//     ...(pagination && { pagination }),
//     ...(stack && { stack }),
//     ...(status && { status }),
//   };

//   return res.status(statusCode).json(response);
// };
