export const MODELS = {
  TEMPLATE: 'Template',

  USER: {
    CORE: 'User',
    PROFILE: 'UserProfile',
    IDENTITY: 'UserIdentity',
    CREDENTIAL: 'UserCredential',
    PROVIDER: 'UserProvider',
  },

  ADMIN: {
    PERMISSION: 'AdminPermission',
    ROLE: 'AdminRole',
    ADMIN: 'Admin',
  },

  COMMON: {
    FILE: 'FILE',
    SESSION: 'Session',
    REFRESH_TOKEN: 'RefreshToken',
    OTP: 'Otp',
  },
} as const;
