// src/utils/sendEmail.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

/**
 * @desc Sends an email using Nodemailer with both HTML and text fallback.
 * @param {object} options - An object containing email details.
 * @param {string} options.email - The recipient's email address.
 * @param {string} options.subject - The subject line of the email.
 * @param {string} options.message - The plain text body of the email.
 * @param {string} options.type - The type of email ('verification' or 'reset').
 * @returns {Promise<boolean>} A promise that resolves to true on success, false on failure.
 */

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options) => {
  // Extract the URL from the message, which can be either a reset or verification link
  const urlRegex = /(https?:\/\/[^\s"]+)/g;
  const match = options.message.match(urlRegex);
  const actionUrl = match ? match[0] : options.message;

  let htmlMessage = "";
  let textContent = options.message;

  // Determine the email content based on the type
  switch (options.type) {
    case "verification":
      htmlMessage = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">Email Verification</h2>
          <p>
            Thank you for signing up! Please click the link below to verify your email address and activate your account.
          </p>
          <p>
            <a href="${actionUrl}" 
               style="display: inline-block; padding: 10px 20px; background-color: #2c3e50; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;" 
               target="_blank">
               Verify Your Account
            </a>
          </p>
          <p>
            If you did not sign up for this service, please ignore this email.
          </p>
          <hr style="margin-top: 20px; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #888;">
            This link will expire shortly for security reasons.
          </p>
        </div>
      `;
      textContent = `Thank you for signing up! Please click the link below to verify your email address:\n\n${actionUrl}`;
      break;

    case "reset":
    default:
      htmlMessage = actionUrl
        ? `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">Password Reset Request</h2>
            <p>
              You are receiving this email because <strong>you (or someone else)</strong> 
              requested a password reset for your account.
            </p>
            <p>
              Please click the link below to reset your password:
            </p>
            <p>
              <a href="${actionUrl}" 
                 style="color: #1a73e8; text-decoration: underline; font-weight: bold;" 
                 target="_blank">
                 Reset your password
              </a>
            </p>
            <p>
              If you did not request this, please ignore this email. 
              <br/>
              <strong>Your password will remain unchanged.</strong>
            </p>
            <hr style="margin-top: 20px; border: none; border-top: 1px solid #ddd;" />
            <p style="font-size: 12px; color: #888;">
              This link will expire in 1 hour for security reasons.
            </p>
          </div>
        `
        : options.message.replace(/\n/g, "<br/>"); // fallback for non-URL emails
      break;
  }

  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: textContent, // plain text fallback
    html: htmlMessage, // styled HTML
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default sendEmail;