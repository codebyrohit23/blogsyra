import { Router } from 'express';
import { auth, validate } from '@/middlewares';
import { Role, ValidationSource } from '@/shared/constants';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from './schemas';

import { authController } from './auth.module';

export const authRoutes = Router();

authRoutes
  .post('/login', validate(loginSchema, ValidationSource.BODY), authController.login)

  .post('/register', validate(registerSchema, ValidationSource.BODY), authController.register)

  .post(
    '/forgot-password',
    validate(forgotPasswordSchema, ValidationSource.BODY),
    authController.forgotPassword
  )

  .post('/verify-otp', validate(verifyOtpSchema, ValidationSource.BODY), authController.verifyOtp)

  .post(
    '/reset-password',
    validate(resetPasswordSchema, ValidationSource.BODY),
    authController.resetPassword
  )

  .post('/refresh', authController.resetPassword)

  // AUTH REQUIRED
  .get('/me', auth(Role.ADMIN), authController.getMe)

  .patch('/me', auth(Role.ADMIN), authController.updateMe)

  .patch('/change-password', auth(Role.ADMIN), authController.changePassword)

  .patch('/logout', auth(Role.ADMIN), authController.logout);
