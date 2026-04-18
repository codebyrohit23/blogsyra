// import { config } from '@/core/config';
// import { sgMail } from './config';
// import { EmailPayload } from './email.type';
// import { logger } from '@/core/logger';

// export class EmailService {
//   // public sendEmail = async ({ to, subject, text, html }: EmailPayload) => {
//   //   try {
//   //     const mailOptions = {
//   //       from: config.email.from,
//   //       to,
//   //       subject,
//   //       text,
//   //       html,
//   //     };

//   //     const info = await transporter.sendMail(mailOptions);
//   //     logger.info({ response: info.response }, '✅ Email sent:');

//   //     return info;
//   //   } catch (error) {
//   //     logger.error(error, '❌ Email error:');
//   //     throw error;
//   //   }
//   // };

//   public sendEmail = async ({ to, subject, text, html }: EmailPayload) => {
//     const msg = {
//       to,
//       from: config.sendGrid.from,
//       subject,
//       text,
//       html,
//     };

//     try {
//       await sgMail.send(msg);
//       logger.info(`Email sent successfully to ${to}`);
//     } catch (error) {
//       logger.error({ error }, 'Email send failed:');
//       throw new Error('Email service unavailable');
//     }
//   };
// }
