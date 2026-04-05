// export const REDIS_KEYS = {
//   admin: {
//     permission: {
//       permissionById: (id: string) => `admin:role:${id}`,
//     },
//     role: {
//       roleById: (id: string) => `admin:role:${id}`,
//     },
//   },
//   app: {},
//   auth: {
//     blacklist: (jti: string) => `auth:blacklist:${jti}`,
//     session: (sessionId: string) => `auth:session:${sessionId}`,
//     resetPassword: (jti: string) => `auth:reset:${jti}`,
//   },

//   admins: {
//     roles: (id: string) => `admin:roles:${id}`,
//     profile: (id: string) => `admin:profile:${id}`,
//   },

//   otp: {
//     email: (jti: string) => `otp:email:${jti}`,
//     sms: (jti: string) => `otp:sms:${jti}`,
//   },

//   user: {
//     profile: (id: string) => `user:profile:${id}`,
//     settings: (id: string) => `user:settings:${id}`,
//   },

//   cache: {
//     post: (id: string) => `cache:post:${id}`,
//     postsPage: (page: number) => `cache:posts:page:${page}`,
//   },
// } as const;
