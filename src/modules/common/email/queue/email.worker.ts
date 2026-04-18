import { Job } from 'bullmq';
import { EmailQueues } from '../email.type';
import { BaseWorker } from '@/infra/queue';
import { EmailPayload } from '@/infra/email';
import { emailProcessor, EmailProcessor } from './email.processor';

class EmailWorker extends BaseWorker<EmailPayload> {
  constructor(private emailProcessor: EmailProcessor) {
    super('email');
  }

  protected async process(job: Job<EmailPayload>) {
    switch (job.name) {
      case EmailQueues.OTP:
        this.emailProcessor.handleOtp(job.data);
        break;
    }
  }
}

new EmailWorker(emailProcessor);
