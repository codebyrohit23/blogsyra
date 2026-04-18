import { cacheService } from '@/infra/cache';
import { RefreshTokenRepository, SessionRepository } from './repositories';
import {
  AuthService,
  JWTManagerService,
  JWTService,
  RefreshTokenService,
  SessionService,
} from './services';

const sessionRepository = new SessionRepository();
const refreshTokenRepository = new RefreshTokenRepository();

const jwtService = new JWTService();
const jwtManagerService = new JWTManagerService(jwtService, cacheService);

const sessionService = new SessionService(sessionRepository, cacheService);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);

export const authService = new AuthService(jwtManagerService, sessionService, refreshTokenService);
