import { registerRoute } from '@/docs/openapi/register-route';
import { z } from 'zod';
import { HttpMethod } from '@/shared/constants';

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  updateMeSchema,
  refreshSchema,
} from '../schemas';

//
// ✅ COMMON RESPONSES
//

const messageResponse = z
  .object({
    message: z.string(),
  })
  .meta({ id: 'MessageResponse' });

const tokenResponse = z
  .object({
    token: z.string(),
  })
  .meta({ id: 'TokenResponse' });

const loginResponse = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .meta({ id: 'LoginResponse' });

const meResponse = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  })
  .meta({ id: 'MeResponse' });

//
// 🚀 ROUTES (ORDER SAME AS ROUTER)
//

// 1️⃣ VERIFY EMAIL
registerRoute({
  method: HttpMethod.POST,
  path: '/auth/verify-email',
  tag: 'Auth',
  body: verifyEmailSchema,
  response: messageResponse,
  summary: 'Send email verification OTP',
});

// 2️⃣ VERIFY OTP
registerRoute({
  method: HttpMethod.POST,
  path: '/auth/verify-otp',
  tag: 'Auth',
  body: verifyOtpSchema,
  response: tokenResponse,
  summary: 'Verify OTP and return token',
});

// 3️⃣ REGISTER
registerRoute({
  method: HttpMethod.POST,
  path: '/auth/register',
  tag: 'Auth',
  body: registerSchema,
  response: messageResponse,
  summary: 'Register user',
});

// 4️⃣ LOGIN
registerRoute({
  method: HttpMethod.POST,
  path: '/auth/login',
  tag: 'Auth',
  body: loginSchema,
  response: loginResponse,
  summary: 'Login user',
});

// 5️⃣ FORGOT PASSWORD
registerRoute({
  method: HttpMethod.POST,
  path: '/auth/forgot-password',
  tag: 'Auth',
  body: forgotPasswordSchema,
  response: messageResponse,
  summary: 'Send reset password OTP',
});

// 6️⃣ RESET PASSWORD
registerRoute({
  method: HttpMethod.POST,
  path: '/auth/reset-password',
  tag: 'Auth',
  body: resetPasswordSchema,
  response: messageResponse,
  summary: 'Reset user password',
});

// 7️⃣ REFRESH TOKEN
registerRoute({
  method: HttpMethod.POST,
  path: '/auth/refresh',
  tag: 'Auth',
  body: refreshSchema,
  response: loginResponse,
  summary: 'Refresh access token',
});

// 🔐 AUTH REQUIRED

// 8️⃣ GET ME
registerRoute({
  method: HttpMethod.GET,
  path: '/auth/me',
  tag: 'Auth',
  response: meResponse,
  summary: 'Get current user',
  auth: true,
});

// 9️⃣ UPDATE ME
registerRoute({
  method: HttpMethod.PATCH,
  path: '/auth/me',
  tag: 'Auth',
  body: updateMeSchema,
  response: meResponse,
  summary: 'Update current user',
  auth: true,
});

// 🔟 CHANGE PASSWORD
registerRoute({
  method: HttpMethod.PATCH,
  path: '/auth/change-password',
  tag: 'Auth',
  response: messageResponse,
  summary: 'Change password',
  auth: true,
});

// 1️⃣1️⃣ LOGOUT
registerRoute({
  method: HttpMethod.POST,
  path: '/auth/logout',
  tag: 'Auth',
  response: messageResponse,
  summary: 'Logout user',
  auth: true,
});
