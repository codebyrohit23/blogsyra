import { config } from '@/core/config';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(config.sendGrid.apiKey);

export { sgMail };
