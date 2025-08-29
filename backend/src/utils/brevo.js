import SibApiV3Sdk from '@getbrevo/brevo';

const brevoClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = brevoClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendResetEmail = async (toEmail, resetLink) => {
  const sender = { email: "your_email@domain.com", name: "YourApp" };
  const receivers = [{ email: toEmail }];

  try {
    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Password Reset Request",
      htmlContent: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
import { verify } from 'jsonwebtoken';
import User from '../models/User.js';