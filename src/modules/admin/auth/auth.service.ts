import { AdminLean, AdminService } from '@/modules/admin/admins';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateMeDto,
  VerifyOtpDto,
} from './schemas';
import { AuthService, AuthTokenPairResponse, TokenType } from '@/modules/common/auth';
import { LoginResponse } from './auth.type';
import { buildAdminResponse, validateAccountStatus } from './helpers';
import { invalidCredentialError, jwtInvalidError, missingTokenError } from '@/core/error';
import { AccountStatus, HttpStatus, Role } from '@/shared/constants';
import { ApiError, comparePassword, hashPassword } from '@/shared/utils';
import { OtpPurpose, OtpRefType, OtpService } from '@/modules/common/otp';
import { logger } from '@/core/logger';
import { config } from '@/core/config';

export class AdminAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly otpService: OtpService
  ) {}

  public async login(payload: LoginDto): Promise<LoginResponse> {
    const { email, password } = payload;

    const admin = await this.adminService.getAdminByEmailWithPassword(email);

    if (!admin) throw invalidCredentialError();

    if (!(await comparePassword(password, admin.password))) {
      throw invalidCredentialError();
    }

    validateAccountStatus(admin.status);

    const sessionAndTokenResponse = await this.authService.createSessionAndIssueTokens({
      id: admin._id,
      role: Role.ADMIN,
      platform: payload.platform,
      deviceId: payload.deviceId,
      fcmToken: payload.fcmToken,
      timezone: payload.timeZone,
    });

    const adminResponse = buildAdminResponse(admin);

    return { admin: adminResponse, tokensResponse: sessionAndTokenResponse.token };
  }

  public async register(payload: RegisterDto) {
    const exists = await this.adminService.exists({ email: payload.email });

    if (exists) throw new ApiError('Admin already exists with this email', HttpStatus.BAD_REQUEST);

    const passwordHash = await hashPassword(payload.password, config.auth.saltRounds);

    const admin = await this.adminService.create({ ...payload, password: passwordHash });

    const sessionAndTokenResponse = await this.authService.createSessionAndIssueTokens({
      id: admin._id,
      role: Role.ADMIN,
      platform: payload.platform,
      deviceId: payload.deviceId,
      fcmToken: payload.fcmToken,
      timezone: payload.timeZone,
    });

    const adminResponse = buildAdminResponse(admin);

    return { admin: adminResponse, tokensResponse: sessionAndTokenResponse.token };
  }

  public async forgotPassword(payload: ForgotPasswordDto) {
    const admin = await this.adminService.getAdminByEmail(payload.email);

    if (!admin) {
      logger.warn(`Forgot password attempted for non-existing email  ${payload.email}`);
      return;
    }

    await this.otpService.sendOtp(
      admin._id,
      admin.email,
      OtpPurpose.RESET_PASSWORD,
      OtpRefType.ADMIN
    );
  }

  public async verifyOtp(payload: VerifyOtpDto): Promise<string> {
    const admin = await this.adminService.getAdminByEmail(payload.email);

    if (!admin) throw new ApiError('Invalid or expired OTP');

    const otpPayload = {
      refId: admin._id,
      refType: OtpRefType.ADMIN,
      purpose: payload.purpose,
      code: payload.otp,
    };

    await this.otpService.verifyOtp(otpPayload);

    const tokenResponse = await this.authService.getResetPasswordToken({
      id: admin._id.toString(),
      role: Role.ADMIN,
    });

    return tokenResponse.token;
  }

  public async resetPassword(payload: ResetPasswordDto) {
    const { token, password } = payload;

    const resetTokenPayload = await this.authService.verifyToken(token, TokenType.RESET_PASSWORD);

    const admin = await this.adminService.getAdminByIdWithPassword(resetTokenPayload.sub);

    if (!admin) throw jwtInvalidError();

    if (await comparePassword(password, admin.password)) {
      throw new ApiError('Please choose a different password', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await hashPassword(password);

    await this.adminService.updatePasswordById(admin._id, passwordHash);
  }

  public async refresh(refreshToken: string): Promise<AuthTokenPairResponse> {
    if (!refreshToken) throw missingTokenError();

    return this.authService.refresh(refreshToken);
  }

  // AUTH REQUIRED
  public async getMe(id: string): Promise<AdminLean> {
    const admin = await this.adminService.getAdminById(id);

    return admin;
  }

  public async updateMe(id: string, payload: UpdateMeDto): Promise<AdminLean> {
    return this.adminService.updateAdminById(id, payload);
  }

  public async changePassword(id: string, payload: ChangePasswordDto) {
    const admin = await this.adminService.getAdminByIdWithPassword(id);

    if (!admin) throw new ApiError('Unauthorize', HttpStatus.UNAUTHORIZED);

    const { password, currentPassword } = payload;

    if (await comparePassword(currentPassword, admin.password)) {
      throw new ApiError('Current password is incorrect.', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await hashPassword(password);

    await this.adminService.updatePasswordById(admin._id, passwordHash);
  }

  public async logout(accessToken: string) {
    if (!accessToken) throw missingTokenError();

    return this.authService.logout(accessToken);
  }
}
