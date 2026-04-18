import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
  ResetPasswordDto,
  SocialLoginDto,
  UpdateMeDto,
  VerifyEmailDto,
  VerifyOtpDto,
} from './schemas';

import { AuthService, TokenType } from '@/modules/common/auth';
import { AuthResponse, AuthTokenResponse, UserIAndIdentity } from './auth.type';
import { validateAccountStatus } from './helpers';
import { invalidCredentialError, jwtInvalidError, missingTokenError } from '@/core/error';
import { AuthProvider, HttpStatus, Role } from '@/shared/constants';
import { ApiError, comparePassword, hashPassword } from '@/shared/utils';
import { OtpPurpose, OtpRefType, OtpService } from '@/modules/common/otp';
import { logger } from '@/core/logger';

import {
  CredentialService,
  IdentityLean,
  IdentityService,
  ProviderService,
  UserLean,
  UserService,
} from '../user';

import { withTransaction } from '@/core/db/toolkit';
import { getConnection } from '@/infra/db/mongo';
import { MongoId } from '@/shared/types';
import { GoogleProvider } from '@/infra/oauth/google.provider';
import { IdTokenPayload } from '@/infra/oauth';

export class UserAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly credentialService: CredentialService,
    private readonly identityService: IdentityService,
    private readonly providerService: ProviderService,
    private readonly googleProvider: GoogleProvider,
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

    return this.getTokenByPurpose(identity.userId, payload.purpose);
  }

  private async getTokenByPurpose(userId: MongoId, purpose: OtpPurpose): Promise<string> {
    switch (purpose) {
      case OtpPurpose.VERIFY_EMAIL: {
        const tokenResponse = await this.authService.getEmailVerificationToken({
          id: userId,
          role: Role.USER,
        });
        return tokenResponse.token;
      }

      case OtpPurpose.RESET_PASSWORD: {
        const tokenResponse = await this.authService.getResetPasswordToken({
          id: userId,
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

    const exists = await this.userService.getUserById(tokenResponse.sub);

    if (!exists) throw new ApiError('First verify your email address');

    const connection = getConnection();

    const userId = exists._id;

    const { user, identity } = await withTransaction(connection, async (session) => {
      const user = await this.userService.updateUser(userId, payload);

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

    if (!identity) throw new ApiError('Please verify your email first');

    const { token } = await this.authService.createSessionAndIssueTokens({
      id: user._id,
      role: Role.USER,
      platform: payload.platform,
      deviceId: payload.deviceId,
      fcmToken: payload.fcmToken,
      timezone: payload.timeZone,
    });

    await this.authService.revokeToken(tokenResponse.jti);

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

    const user = await this.userService.getUserById(identity.userId);

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

  public async socialLogin(payload: SocialLoginDto): Promise<AuthResponse> {
    const tokenPaylod = await this.verifySocialIdToken(payload.provider, payload.idToken);

    if (!tokenPaylod) {
      throw new ApiError('Invalid auth token', HttpStatus.UNAUTHORIZED);
    }

    return this.handleSocialLogin(payload, tokenPaylod);
  }

  private async handleSocialLogin(
    payload: SocialLoginDto,
    idTokenPayload: IdTokenPayload
  ): Promise<AuthResponse> {
    const { email, sub, name, picture } = idTokenPayload;
    const { provider } = payload;

    let userProvider = await this.providerService.getProvider(provider, sub);

    let identity = email ? await this.identityService.getIdentityByEmail(email) : null;

    if (!userProvider && !identity) {
      const connection = getConnection();

      userProvider = await withTransaction(connection, async (session) => {
        const user = await this.userService.createUser({ name, avatar: picture }, session);

        const userProvider = await this.providerService.createProvider(
          {
            userId: user._id,
            provider,
            providerId: sub,
          },
          session
        );

        if (email) {
          await this.identityService.createUserIdentity(
            { userId: user._id, email, emailVerified: true },
            session
          );
        }

        return userProvider;
      });
    } else if (!userProvider && identity) {
      userProvider = await this.providerService.createProvider({
        userId: identity.userId,
        provider,
        providerId: sub,
      });
    }

    if (!userProvider) {
      throw new ApiError('Faled to login');
    }

    const user = await this.userService.getUserById(userProvider.userId);

    if (!user) {
      throw new ApiError('Faled to login');
    }

    if (!identity) {
      identity = await this.identityService.getIdentityByUserId(userProvider.userId);
    }

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
      identity: identity,
      token: {
        accessToken: token.access.token,
        refreshToken: token.refresh.token,
      },
    };
  }

  private async verifySocialIdToken(provider: AuthProvider, idToken: string) {
    switch (provider) {
      case AuthProvider.GOOGLE:
        return this.googleProvider.verifyToken(idToken);

      default:
        throw new Error('Unsupported provider');
    }
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

    const userId = tokenPayload.sub;

    const credential = await this.credentialService.getCredentialByUserId(userId);

    if (!credential) throw jwtInvalidError();

    if (await comparePassword(password, credential.password)) {
      throw new ApiError('Please choose a different password', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await hashPassword(password);

    await this.credentialService.updateCredentialByUserId(userId, { password: passwordHash });

    await this.authService.revokeToken(tokenPayload.jti);
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
  public async getMe(id: MongoId): Promise<UserIAndIdentity> {
    const [user, identity] = await Promise.all([
      this.userService.getUserById(id),
      this.identityService.getIdentityByUserId(id),
    ]);

    if (!user) throw new ApiError('Unauthorized', HttpStatus.UNAUTHORIZED);

    return { user, identity };
  }

  public async updateMe(id: MongoId, payload: UpdateMeDto): Promise<UserLean> {
    return this.userService.updateUser(id, {
      ...payload,
      dob: payload.dob ? new Date(`${payload.dob}T00:00:00Z`) : undefined,
    });
  }

  public async changePassword(id: MongoId, payload: ChangePasswordDto) {
    const credential = await this.credentialService.getCredentialByUserId(id);

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
