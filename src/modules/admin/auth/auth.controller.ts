import { asyncHandler, sendResponse } from '@/shared/utils';
import { AdminAuthService } from './auth.service';

import { Request, Response } from 'express';
import { ApiResponse } from '@/shared/types';
import { AuthResponse } from './auth.type';
import { config } from '@/core/config';
import { Environment, HttpStatus, REDIS_TTL, REFRESH_TOKEN } from '@/shared/constants';
import { missingTokenError } from '@/core/error';
import { AdminLean } from '../admins';

export class AuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  login = asyncHandler(async (req: Request, res: Response<ApiResponse<AuthResponse>>) => {
    const { admin, tokensResponse } = await this.adminAuthService.login(req.body);

    const cookieMaxAge = REDIS_TTL.REFRESH_TOKEN;

    res.cookie(REFRESH_TOKEN, tokensResponse.refresh.token, {
      httpOnly: true,
      secure: config.app.nodeEnv === Environment.PRODUCTION,
      sameSite: 'strict',
      maxAge: cookieMaxAge * 1000,
    });

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: {
        admin: admin,
        token: { access: tokensResponse.access },
      },
    });
  });

  register = asyncHandler(async (req: Request, res: Response<ApiResponse<AuthResponse>>) => {
    const { admin, tokensResponse } = await this.adminAuthService.register(req.body);

    const cookieMaxAge = config.auth.jwt.refresh.expiresIn;

    res.cookie(REFRESH_TOKEN, tokensResponse.refresh.token, {
      httpOnly: true,
      secure: config.app.nodeEnv === Environment.PRODUCTION,
      sameSite: 'strict',
      maxAge: cookieMaxAge * 1000,
    });

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: {
        admin: admin,
        token: { access: tokensResponse.access },
      },
    });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    await this.adminAuthService.forgotPassword(req.body);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: {
        message: 'If an account exists, OTP has been sent',
      },
    });
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const resetPasswordToken = await this.adminAuthService.verifyOtp(req.body);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'If an account exists, OTP has been sent',
      data: {
        token: resetPasswordToken,
      },
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    await this.adminAuthService.resetPassword(req.body);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Password updated successfully',
    });
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies[REFRESH_TOKEN];

    const response = await this.adminAuthService.refresh(refreshToken);

    const cookieMaxAge = config.auth.jwt.refresh.expiresIn;

    res.cookie(REFRESH_TOKEN, response.refresh.token, {
      httpOnly: true,
      secure: config.app.nodeEnv === Environment.PRODUCTION,
      sameSite: 'strict',
      maxAge: cookieMaxAge * 1000,
    });

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: {
        token: { access: response.access },
      },
    });
  });

  // AUTH REQUIRED
  getMe = asyncHandler(async (req: Request, res: Response<ApiResponse<AdminLean>>) => {
    console.log(req.user.sub);
    const admin = await this.adminAuthService.getMe(req.user.sub);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      data: admin,
    });
  });

  updateMe = asyncHandler(async (req: Request, res: Response<ApiResponse<AdminLean>>) => {
    const admin = await this.adminAuthService.updateMe(req.user.sub, req.body);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Updated successfully',
      data: admin,
    });
  });

  changePassword = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    await this.adminAuthService.changePassword(req.user.sub, req.body);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Password updated successfully',
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) throw missingTokenError();

    const token = authHeader.split(' ')[1];

    await this.adminAuthService.logout(token);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      message: 'Logout successfully',
    });
  });
}
