// src/utils/sendEmail.js

// Using Nodemailer for sending emails.
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

/**
 * @desc Sends an email using Nodemailer.
 * @param {object} options - An object containing email details.
 * @param {string} options.email - The recipients email address.
 * @param {string} options.subject - The subject line of the email.
 * @param {string} options.message - The body of the email.
 * @returns {Promise<void>}
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  console.log('Sending email to:', options.email);
  console.log('Subject:', options.subject);

  const urlRegex = /(https?:\/\/[^\s"]+)/g;
  const links = options.message.match(urlRegex);
  if (links) {
    console.log('Links in message:', links);
  } else {
    console.log('No links found in message.');
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default sendEmail;