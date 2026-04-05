import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateMeDto,
  VerifyEmailDto,
  VerifyOtpDto,
} from './schemas';

import { AuthService, AuthTokenPairResponse, TokenType } from '@/modules/common/auth';
import { AuthResponse, AuthTokenResponse, UserIAndIdentity } from './auth.type';
import { validateAccountStatus } from './helpers';
import { invalidCredentialError, jwtInvalidError, missingTokenError } from '@/core/error';
import { HttpStatus, Role } from '@/shared/constants';
import { ApiError, comparePassword, convertToObjectId, hashPassword } from '@/shared/utils';
import { OtpPurpose, OtpRefType, OtpService } from '@/modules/common/otp';
import { logger } from '@/core/logger';
import { CredentialService, IdentityService, UserLean, UserService } from '../user';
import { withTransaction } from '@/core/db/toolkit';
import { getConnection } from '@/core/db/connection';

export class UserAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly credentialService: CredentialService,
    private readonly identityService: IdentityService,
    private readonly otpService: OtpService
  ) {}

  public async verifyEmail(payload: VerifyEmailDto) {
    const { email } = payload;

    let userIdentity = await this.identityService.getIdentityByEmail(email);

    if (userIdentity && userIdentity.emailVerified) {
      throw new ApiError('User already exists with this email');
    }

    if (!userIdentity) {
      const connection = await getConnection();

      const { identity } = await withTransaction(connection, async (session) => {
        const user = await this.userService.createUser({}, session);

        const userId = user._id;

        const identity = await this.identityService.createUserIdentity({ userId, email }, session);

        return { user, identity };
      });

      userIdentity = identity;
    }

    return this.otpService.sendOtp(
      userIdentity.userId,
      email,
      OtpPurpose.VERIFY_EMAIL,
      OtpRefType.USER
    );
  }

  public async verifyOtp(payload: VerifyOtpDto): Promise<string> {
    const identity = await this.identityService.getIdentityByEmail(payload.email);

    if (!identity) throw new ApiError('Invalid or expired OTP');

    const otpPayload = {
      refId: identity.userId,
      refType: OtpRefType.USER,
      purpose: payload.purpose,
      code: payload.otp,
    };

    await this.otpService.verifyOtp(otpPayload);

    return this.getTokenByPurpose(identity.userId.toString(), payload.purpose);
  }

  private async getTokenByPurpose(userId: string, purpose: OtpPurpose): Promise<string> {
    switch (purpose) {
      case OtpPurpose.VERIFY_EMAIL: {
        const tokenResponse = await this.authService.getEmailVerificationToken({
          id: userId.toString(),
          role: Role.USER,
        });
        return tokenResponse.token;
      }

      case OtpPurpose.RESET_PASSWORD: {
        const tokenResponse = await this.authService.getResetPasswordToken({
          id: userId.toString(),
          role: Role.USER,
        });
        return tokenResponse.token;
      }

      default:
        throw new ApiError('Unsupported OTP purpose');
    }
  }

  public async register(payload: RegisterDto): Promise<AuthResponse> {
    const tokenResponse = await this.authService.verifyToken(
      payload.token,
      TokenType.EMAIL_VERIFICATION
    );

    const connection = getConnection();

    const exists = await this.userService.getUserById(tokenResponse.sub);

    if (!exists) throw jwtInvalidError();

    const userId = exists._id;

    const { user, identity } = await withTransaction(connection, async (session) => {
      const user = await this.userService.updateUser(userId.toString(), payload);

      const passwordHash = await hashPassword(payload.password);

      const [credential, identity] = await Promise.all([
        this.credentialService.createCredential(
          {
            userId: user._id,
            password: passwordHash,
          },
          session
        ),
        this.identityService.updateIdentity(userId, { emailVerified: true }),
      ]);

      return { user, credential, identity };
    });

    const { token } = await this.authService.createSessionAndIssueTokens({
      id: user._id,
      role: Role.USER,
      platform: payload.platform,
      deviceId: payload.deviceId,
      fcmToken: payload.fcmToken,
      timezone: payload.timeZone,
    });

    if (!identity) throw new ApiError('Please verify your email first');

    return {
      user,
      identity,
      token: {
        accessToken: token.access.token,
        refreshToken: token.refresh.token,
      },
    };
  }

  public async login(payload: LoginDto): Promise<AuthResponse> {
    const { email, password } = payload;

    const identity = await this.identityService.getIdentityByEmail(email);

    if (!identity || !identity.emailVerified) throw invalidCredentialError();

    const credential = await this.credentialService.getCredentialByUserId(identity.userId);

    if (!credential || !(await comparePassword(password, credential.password))) {
      throw invalidCredentialError();
    }

    const user = await this.userService.getUserById(identity.userId.toString());

    if (!user) throw invalidCredentialError();

    validateAccountStatus(user.status);

    const { token } = await this.authService.createSessionAndIssueTokens({
      id: user._id,
      role: Role.USER,
      platform: payload.platform,
      deviceId: payload.deviceId,
      fcmToken: payload.fcmToken,
      timezone: payload.timeZone,
    });

    return {
      user,
      identity,
      token: {
        accessToken: token.access.token,
        refreshToken: token.refresh.token,
      },
    };
  }

  public async forgotPassword(payload: ForgotPasswordDto) {
    const identity = await this.identityService.getIdentityByEmail(payload.email);

    if (!identity) {
      logger.warn(`Forgot password attempted for non-existing email  ${payload.email}`);
      return;
    }

    await this.otpService.sendOtp(
      identity.userId,
      payload.email,
      OtpPurpose.RESET_PASSWORD,
      OtpRefType.USER
    );
  }

  public async resetPassword(payload: ResetPasswordDto) {
    const { token, password } = payload;

    const tokenPayload = await this.authService.verifyToken(token, TokenType.RESET_PASSWORD);

    const userId = convertToObjectId(tokenPayload.sub);

    const credential = await this.credentialService.getCredentialByUserId(userId);

    if (!credential) throw jwtInvalidError();

    if (await comparePassword(password, credential.password)) {
      throw new ApiError('Please choose a different password', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await hashPassword(password);

    await this.credentialService.updateCredentialByUserId(userId, { password: passwordHash });
  }

  public async refresh(payload: RefreshDto): Promise<AuthTokenResponse> {
    const { refreshToken } = payload;
    console.log('refreshToken', refreshToken);
    if (!refreshToken) throw missingTokenError();

    const response = await this.authService.refresh(refreshToken);

    return {
      accessToken: response.access.token,
      refreshToken: response.refresh.token,
    };
  }

  // AUTH REQUIRED
  public async getMe(id: string): Promise<UserIAndIdentity> {
    const [user, identity] = await Promise.all([
      this.userService.getUserById(id),
      this.identityService.getIdentityByUserId(convertToObjectId(id)),
    ]);

    if (!user || !identity) throw new ApiError('Unauthorized', HttpStatus.UNAUTHORIZED);

    return { user, identity };
  }

  public async updateMe(id: string, payload: UpdateMeDto): Promise<UserLean> {
    return this.userService.updateUser(id, {
      ...payload,
      avatar: payload.avatar ? convertToObjectId(payload.avatar) : undefined,
      coverImage: payload.coverImage ? convertToObjectId(payload.coverImage) : undefined,
      dob: payload.dob ? new Date(`${payload.dob}T00:00:00Z`) : undefined,
    });
  }

  public async changePassword(id: string, payload: ChangePasswordDto) {
    const credential = await this.credentialService.getCredentialByUserId(convertToObjectId(id));

    const { password, currentPassword } = payload;

    if (!credential || (await comparePassword(currentPassword, credential.password))) {
      throw new ApiError('Current password is incorrect.', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await hashPassword(password);

    await this.credentialService.updateCredentialByUserId(credential.userId, {
      password: passwordHash,
    });
  }

  public async logout(accessToken: string) {
    if (!accessToken) throw missingTokenError();

    return this.authService.logout(accessToken);
  }
}
