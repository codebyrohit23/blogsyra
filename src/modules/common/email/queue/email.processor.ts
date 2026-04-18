import { emailService, EmailService } from '@/infra/email';
import { EmailPayload } from '../email.type';

export class EmailProcessor {
  constructor(private emailService: EmailService) {}

  async handleOtp(payload: EmailPayload) {
    await this.emailService.sendEmail({
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
  }

  async handleWelcome(payload: EmailPayload) {
    await this.emailService.sendEmail({
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
  }
}

export const emailProcessor = new EmailProcessor(emailService);
