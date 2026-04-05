// import { CacheService } from '@/core/cache';
// import { SessionRepository } from '../repositories/session.repository';
// import { LoginRequest } from '../schemas/auth';
// import { AdminService } from '@/modules/admin/admins';
// import { invalidCredentialError } from '@/core/error';
// import { ApiError, comparePassword, generateUniqueId } from '@/shared/utils';
// import {
//   AccountStatus,
//   HttpStatus,
//   RoleEnum,
//   REFRESH_TOKEN,
//   Environment,
// } from '@/shared/constants';
// import { TokenManager } from '@/modules/common/token';
// import { config } from '@/core/config';

// import { Response } from 'express';
// import { LoginResponse } from '../auth.type';

// class AuthService {
//   constructor(
//     private readonly sessionRepo: SessionRepository,
//     private readonly cache: CacheService,
//     private readonly adminService: AdminService,
//     private readonly tokenManager: TokenManager
//   ) {}

//   public async login(payload: LoginRequest, res: Response): Promise<LoginResponse> {
//     const { email, password, deviceId, deviceType, fcmToken } = payload;

//     const admin = await this.adminService.getAdminByEmailWithPassword(email);

//     if (!comparePassword(password, admin.password)) throw invalidCredentialError();

//     if (admin.status === AccountStatus.INACTIVE)
//       throw new ApiError('Account is deactivated', HttpStatus.FORBIDDEN);

//     if (admin.status === AccountStatus.DELETED)
//       throw new ApiError('Account has been deleted', HttpStatus.FORBIDDEN);

//     if (admin.status === AccountStatus.BLOCKED)
//       throw new ApiError('Account is blocked. Contact administrator', HttpStatus.FORBIDDEN);

//     if (!comparePassword(password, admin.password)) throw invalidCredentialError();

//     // genrate token
//     const sessionId = generateUniqueId();

//     const tokenPayload = {
//       id: admin._id?.toString(),
//       sessionId: sessionId,
//       deviceId: deviceId,
//       role: RoleEnum.ADMIN,
//     };

//     const tokenResult = this.tokenManager.generateTokenPair(tokenPayload);

//     const cookieMaxAge = config.token.refresh.expiresIn;

//     res.cookie(REFRESH_TOKEN, tokenResult.refresh.token, {
//       httpOnly: true,
//       secure: config.app.nodeEnv === Environment.PRODUCTION,
//       sameSite: 'strict',
//       maxAge: cookieMaxAge,
//     });

//     const adminResponse = {
//       id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       avatar: admin.avatar,
//       status: admin.status,
//       timezone: admin.timezone,
//       language: admin.language,
//     };

//     const tokenResponse = {
//       accessToken: tokenResult.access.token,
//       expiresAt: tokenResult.access.expiresAt,
//     };

//     const loginResponse = {
//       admin: adminResponse,
//       tokens: tokenResponse,
//     };

//     return loginResponse;
//   }

//   private setRefreshCookie(res: Response, refreshToken: string) {
//     res.cookie(REFRESH_TOKEN, refreshToken, {
//       httpOnly: true,
//       secure: config.app.nodeEnv === Environment.PRODUCTION,
//       sameSite: 'strict',
//       maxAge: config.token.refresh.expiresIn,
//     });
//   }

//   private buildLoginResponse(admin: any, tokenResult: any): LoginResponse {
//     return {
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         avatar: admin.avatar,
//         status: admin.status,
//         timezone: admin.timezone,
//         language: admin.language,
//       },
//       tokens: {
//         accessToken: tokenResult.access.token,
//         expiresAt: tokenResult.access.expiresAt,
//       },
//     };
//   }
// }
