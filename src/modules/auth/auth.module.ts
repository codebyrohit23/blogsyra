import { AuthController } from './auth.controller';
import { otpService } from '@/modules/common/otp';
import { UserAuthService } from './auth.service';
import { credentialService, identityService, providerService, userService } from '../user';
import { authService } from '@/modules/common/auth';
import { googleProvider } from '@/infra/oauth';
import { fileService } from '../common/file';

const adminAuthService = new UserAuthService(
  authService,
  userService,
  credentialService,
  identityService,
  providerService,
  googleProvider,
  otpService,
  fileService
);

export const authController = new AuthController(adminAuthService);
