import { AuthController } from './auth.controller';
import { otpService } from '@/modules/common/otp';
import { UserAuthService } from './auth.service';
import { credentialService, identityService, userService } from '../user';
import { authService } from '@/modules/common/auth';

const adminAuthService = new UserAuthService(
  authService,
  userService,
  credentialService,
  identityService,
  otpService
);

export const authController = new AuthController(adminAuthService);
