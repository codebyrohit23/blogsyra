import { jwtInvalidError, missingTokenError } from '@/core/error';
import { authService, TokenType } from '@/modules/common/auth';
import { Role } from '@/shared/constants';
import { asyncHandler } from '@/shared/utils';
import { Request, Response, NextFunction } from 'express';

// Example admin auth middleware
export const auth = (role: Role) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) throw missingTokenError();

    const token = authHeader.split(' ')[1];

    const payload = await authService.verifyToken(token, TokenType.ACCESS);

    if (payload.role !== role) throw jwtInvalidError();

    req.user = payload;

    next();
  });
