import { baseTemplate } from './base.template';

interface OtpTemplateProps {
  name?: string;
  code: string;
  expiresIn?: number;
}

export const otpTemplate = ({ name = 'User', code, expiresIn = 10 }: OtpTemplateProps): string => {
  const content = `
    <p>Hi <strong>${name}</strong>,</p>

    <p>Your One-Time Password (OTP) is:</p>

    <div style="
      text-align: center;
      background: #f4f6f8;
      padding: 20px;
      margin: 25px 0;
      border-radius: 8px;
      font-size: 32px;
      letter-spacing: 5px;
      font-weight: bold;
      color: #007bff;
      border: 1px dashed #007bff;
      display: inline-block;
      width: 100%;
    ">
      ${code}
    </div>

    <p>This code will expire in <strong>${expiresIn} minutes</strong>. Please do not share it with anyone.</p>

    <p>If you didn’t request this, please ignore this email or contact support immediately.</p>

    <p style="margin-top: 30px;">Best regards,<br><strong>Your Company Team</strong></p>
  `;

  return baseTemplate('Your OTP Code', content);
};
