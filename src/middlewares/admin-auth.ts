// import { jwtInvalidError, missingTokenError } from '@/core/error';
// import { TokenManager } from '@/modules/common/token';
// import { RoleEnum } from '@/shared/constants';
// import { asyncHandler } from '@/shared/utils';
// import { Request, Response, NextFunction } from 'express';

// // Example admin auth middleware
// export const adminAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) throw missingTokenError();

//   const token = authHeader.split(' ')[1];
//   const payload = await TokenManager.verifyAccessToken(token);
//   if (payload.role !== RoleEnum.ADMIN) throw jwtInvalidError();
//   req.user = payload;
//   next();
// });
