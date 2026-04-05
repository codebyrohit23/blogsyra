// import { config } from '@/core/config';
// import rateLimit from 'express-rate-limit';

// const minutes = Math.floor(rateLimitConfig.TIME / (60 * 1000));

// export const authLimiter = rateLimit({
//   windowMs: rateLimitingConfig.time,
//   max: rateLimitingConfig.maxRequest,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     status: 429,
//     error: `Too many login attempts. Please try again after ${minutes} minute${
//       minutes !== 1 ? 's' : ''
//     }.`,
//   },
// });

// export class RateLimiter {
//   static authLimiter = rateLimit({
//     windowMs: config.rateLimit.,
//     max: rateLimitConfig.MAX_REQUEST,
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: {
//       status: 429,
//       error: `Too many login attempts. Please try again after ${minutes} minute${
//         minutes !== 1 ? 's' : ''
//       }.`,
//     },
//   });
// }
