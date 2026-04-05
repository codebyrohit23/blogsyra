// export const TOKEN_REDIS_KEYS = {
//   blacklist: (jti: string) => `auth:blacklist:${jti}`,

//   session: (sessionId: string) => `auth:session:${sessionId}`,
// };
// // Login:
// //   1. SessionService.createSession(refId, role, deviceId, ...)
// //   2. TokenManager.generateTokenPair(sessionId, role)
// //   3. TokenFamilyModel.latestJti = new refresh token jti
// //   4. Redis cache jti & family

// // API Request:
// //   1. Verify access token
// //   2. Check access jti blacklist (Redis)

// // Refresh Request:
// //   1. Verify refresh token signature
// //   2. Check jti in Redis / MongoDB
// //   3. Check tokenFamily.latestJti
// //   4. Rotate: issue new refresh + access token, update latestJti
// //   5. Blacklist old jti

// // Logout:
// //   1. SessionService.revokeSession(sessionId)
// //   2. TokenManager.revokeTokenFamily(tokenFamilyId)
