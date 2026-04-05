import { authService } from '@/modules/common/auth';
import { AuthController } from './auth.controller';
import { AdminAuthService } from './auth.service';
import { adminService } from '../admins';
import { otpService } from '@/modules/common/otp';

const adminAuthService = new AdminAuthService(authService, adminService, otpService);

export const authController = new AuthController(adminAuthService);
