import { asyncHandler, sendSuccess } from '@/shared/utils';
import { UserAuthService } from './auth.service';

import { Request, Response } from 'express';
import { SuccessResponse } from '@/shared/types';
import { AuthResponse, AuthTokenResponse, UserIAndIdentity, VerifyOtpResponse } from './auth.type';
import { HttpStatus } from '@/shared/constants';
import { missingTokenError } from '@/core/error';
import { UserLean } from '../user';

export class AuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  verifyEmail = asyncHandler(async (req: Request, res: Response<SuccessResponse>) => {
    await this.userAuthService.verifyEmail(req.body);

    sendSuccess(res, {
      statusCode: HttpStatus.OK,
      message: 'OTP has been sent to your email please check',
    });
  });

  verifyOtp = asyncHandler(
    async (req: Request, res: Response<SuccessResponse<VerifyOtpResponse>>) => {
      const token = await this.userAuthService.verifyOtp(req.body);

      sendSuccess(res, {
        statusCode: HttpStatus.OK,
        message: 'Otp Verified',
        data: { token },
      });
    }
  );

  register = asyncHandler(async (req: Request, res: Response<SuccessResponse<AuthResponse>>) => {
    const response = await this.userAuthService.register(req.body);

    sendSuccess(res, {
      statusCode: HttpStatus.OK,
      data: response,
    });
  });

  login = asyncHandler(async (req: Request, res: Response<SuccessResponse<AuthResponse>>) => {
    const response = await this.userAuthService.login(req.body);

    sendSuccess(res, {
      statusCode: HttpStatus.OK,
      data: response,
    });
  });

  socialLogin = asyncHandler(async (req: Request, res: Response<SuccessResponse<AuthResponse>>) => {
    const response = await this.userAuthService.socialLogin(req.body);

    sendSuccess(res, {
      statusCode: HttpStatus.OK,
      data: response,
    });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response<SuccessResponse>) => {
    await this.userAuthService.forgotPassword(req.body);

    sendSuccess(res, {
      statusCode: HttpStatus.OK,
      message: 'If an account exists, OTP has been sent',
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response<SuccessResponse>) => {
    await this.userAuthService.resetPassword(req.body);

    sendSuccess(res, {
      statusCode: HttpStatus.OK,
      message: 'Password updated successfully',
    });
  });

  refresh = asyncHandler(
    async (req: Request, res: Response<SuccessResponse<AuthTokenResponse>>) => {
      const response = await this.userAuthService.refresh(req.body);

      sendSuccess(res, {
        statusCode: HttpStatus.OK,
        data: response,
      });
    }
  );

  // AUTH REQUIRED
  getMe = asyncHandler(async (req: Request, res: Response<SuccessResponse<UserIAndIdentity>>) => {
    const user = await this.userAuthService.getMe(req.user.sub);

    sendSuccess(res, {
      statusCode: HttpStatus.OK,
      data: user,
    });
  });

  updateMe = asyncHandler(async (req: Request, res: Response<SuccessResponse<UserLean>>) => {
    const user = await this.userAuthService.updateMe(req.user.sub, req.body);

    sendSuccess(res, {
      statusCode: HttpStatus.OK,
      message: 'Updated successfully',
      data: user,
    });
  });

  changePassword = asyncHandler(async (req: Request, res: Response<SuccessResponse>) => {
    await this.userAuthService.changePassword(req.user.sub, req.body);

    sendSuccess(res, {
      statusCode: HttpStatus.OK,
      message: 'Password updated successfully',
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) throw missingTokenError();

    const token = authHeader.split(' ')[1];

    await this.userAuthService.logout(token);

    sendSuccess(res, {
      statusCode: HttpStatus.OK,
      message: 'Logout successfully',
    });
  });
}
