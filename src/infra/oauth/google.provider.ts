import { config } from '@/core/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

export class GoogleProvider {
  private client = new OAuth2Client(config.auth.google.clinetId);

  async verifyToken(idToken: string): Promise<TokenPayload | undefined> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: config.auth.google.clinetId,
    });

    return ticket.getPayload();
  }
}

export const googleProvider = new GoogleProvider();
