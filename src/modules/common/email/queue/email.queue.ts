import { BaseQueue } from '@/infra/queue';
import { EmailQueues, EmailPayload } from '../email.type';

class EmailQueue extends BaseQueue<EmailPayload> {
  constructor() {
    super('email');
  }

  sendOtp(payload: EmailPayload) {
    return this.add(EmailQueues.OTP, payload, {
      jobId: `otp-${payload.to}`,
    });
  }

  sendWelcomeEmail(payload: EmailPayload) {
    return this.add(EmailQueues.WELCOME, payload, {
      jobId: `welcome-${payload.to}`,
    });
  }
}

export const emailQueue = new EmailQueue();
