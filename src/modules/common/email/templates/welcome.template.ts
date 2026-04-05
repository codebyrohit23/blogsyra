import { baseTemplate } from './base.template';

export const welcomeTemplate = (name: string) => {
  const content = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Welcome to <b>Your Company</b>! We’re thrilled to have you onboard 🎉</p>
    <p>Start exploring your account and enjoy our services.</p>
    <a href="https://yourcompany.com/dashboard" class="button">Go to Dashboard</a>
  `;
  return baseTemplate('Welcome to Your Company', content);
};
