import { config } from '@/core/config';
import { logger } from '@/core/logger';
import { EmailPayload } from './email.types';
import { sgMail } from './sendgrid.client';

export class EmailService {
  public sendEmail = async ({ to, subject, text, html }: EmailPayload) => {
    const msg = {
      to,
      from: config.sendGrid.from,
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      logger.error({ error }, 'Email send failed:');
      throw new Error('Email service unavailable');
    }
  };
}

export const emailService = new EmailService();
