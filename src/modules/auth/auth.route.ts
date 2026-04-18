import { Router } from 'express';
import { auth, validate } from '@/middlewares';
import { Role, ValidationSource } from '@/shared/constants';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  updateMeSchema,
  refreshSchema,
  socialSocialLoginSchema,
} from './schemas';

import { authController } from './auth.module';

export const authRoutes = Router();

authRoutes
  .post(
    '/verify-email',
    validate(verifyEmailSchema, ValidationSource.BODY),
    authController.verifyEmail
  )

  .post('/verify-otp', validate(verifyOtpSchema, ValidationSource.BODY), authController.verifyOtp)

  .post('/register', validate(registerSchema, ValidationSource.BODY), authController.register)

  .post('/login', validate(loginSchema, ValidationSource.BODY), authController.login)

  .post(
    '/social-login',
    validate(socialSocialLoginSchema, ValidationSource.BODY),
    authController.socialLogin
  )

  .post(
    '/forgot-password',
    validate(forgotPasswordSchema, ValidationSource.BODY),
    authController.forgotPassword
  )

  .post(
    '/reset-password',
    validate(resetPasswordSchema, ValidationSource.BODY),
    authController.resetPassword
  )

  .post('/refresh', validate(refreshSchema, ValidationSource.BODY), authController.refresh)

  // AUTH REQUIRED
  .get('/me', auth(Role.USER), authController.getMe)

  .patch(
    '/me',
    auth(Role.USER),
    validate(updateMeSchema, ValidationSource.BODY),
    authController.updateMe
  )

  .patch('/change-password', auth(Role.USER), authController.changePassword)

  .post('/logout', auth(Role.USER), authController.logout);
