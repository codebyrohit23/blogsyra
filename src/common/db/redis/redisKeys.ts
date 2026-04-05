// // src/database/redis/redis.keys.ts

// import { redisConfig, tokenConfig } from '@/config';
// import { OtpEnum } from '@otp/index';

// export const RedisKeys = {
//   DEFAULT: {
//     time: redisConfig.DEFAULT_EXPIRE_TIME,
//   },
//   AUTH: {
//     BLACKLIST: {
//       key: (jti: string) => `auth:blacklist:${jti}`,
//       time: tokenConfig.ACCESS_TOKEN.EXPIRES_IN,
//     },
//     SESSION: {
//       key: (sessionId: string) => `auth:session:${sessionId}`,
//       time: tokenConfig.REFRESH_TOKEN.EXPIRES_IN,
//     },
//     RESET_PASSWORD: {
//       key: (jti: string) => `auth:reset_password:${jti}`,
//       time: tokenConfig.RESET_PASSWORD_TOKEN.EXPIRES_IN,
//     },
//   },
//   ADMIN: {
//     ROLES: {
//       key: (id: string) => `admin:roles:${id}`,
//     },
//     PROFILE: {
//       key: (id: string) => `admin:profile:${id}`,
//     },
//   },

//   OTP: {
//     key: (type: OtpEnum, jti: string) => `${type}:${jti}`,
//   },

//   user: {
//     profile: (userId: string) => `user:profile:${userId}`,
//     settings: (userId: string) => `user:settings:${userId}`,
//   },
//   cache: {
//     posts: (postId: string) => `cache:post:${postId}`,
//     list: (page: number) => `cache:posts:page:${page}`,
//   },
// } as const;
