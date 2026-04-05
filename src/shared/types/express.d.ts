import { AccessTokenPayload } from '@token/token.type';

declare global {
  namespace Express {
    interface Request {
      user: AccessTokenPayload;
    }
  }
}
