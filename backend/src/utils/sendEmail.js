// // src/utils/sendEmail.js
// import dotenv from "dotenv";
// import * as brevo from "@getbrevo/brevo";

// dotenv.config();

// // Create API instance
// const apiInstance = new brevo.TransactionalEmailsApi();

// // Configure API Key
// apiInstance.setApiKey(
//   brevo.TransactionalEmailsApiApiKeys.apiKey,
//   process.env.BREVO_API_KEY
// );

// /**
//  * @desc Sends an email using Brevo API with both HTML + text fallback.
//  * @param {object} options - An object containing email details.
//  * @param {string} options.email - The recipient's email address.
//  * @param {string} options.subject - The subject line of the email.
//  * @param {string} options.message - The plain text body of the email.
//  * @returns {Promise<boolean>}
//  */
// const sendEmail = async (options) => {
//   // If your message contains a reset URL, extract it
//   const urlRegex = /(https?:\/\/[^\s"]+)/g;
//   const match = options.message.match(urlRegex);
//   const resetUrl = match ? match[0] : null;

//   // Build a styled HTML message
//   const htmlMessage = resetUrl
//     ? `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//         <h2 style="color: #2c3e50;">Password Reset Request</h2>
//         <p>
//           You are receiving this email because <strong>you (or someone else)</strong> 
//           requested a password reset for your account.
//         </p>
//         <p>
//           Please click the link below to reset your password:
//         </p>
//         <p>
//           <a href="${resetUrl}" 
//              style="color: #1a73e8; text-decoration: underline; font-weight: bold;" 
//              target="_blank">
//              Reset your password
//           </a>
//         </p>
//         <p>
//           If you did not request this, please ignore this email. 
//           <br/>
//           <strong>Your password will remain unchanged.</strong>
//         </p>
//         <hr style="margin-top: 20px; border: none; border-top: 1px solid #ddd;" />
//         <p style="font-size: 12px; color: #888;">
//           This link will expire in 1 hour for security reasons.
//         </p>
//       </div>
//     `
//     : options.message.replace(/\n/g, "<br/>"); // fallback for non-URL emails

//   const sendSmtpEmail = {
//     sender: { name: process.env.FROM_NAME, email: process.env.EMAIL_USER },
//     to: [{ email: options.email }],
//     subject: options.subject,
//     textContent: options.message, // plain text fallback
//     htmlContent: htmlMessage, // styled HTML
//   };

//   try {
//     const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log("Email sent successfully!");
//     return true;
//   } catch (error) {
//     console.error("Error sending email:", error.response?.body || error);
//     return false;
//   }
// };

// export default sendEmail;

// src/utils/sendEmail.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @desc Sends an email using Gmail SMTP with Nodemailer
 * @param {object} options - An object containing email details.
 * @param {string} options.email - The recipient's email address.
 * @param {string} options.subject - The subject line of the email.
 * @param {string} options.message - The plain text body of the email.
 * @returns {Promise<boolean>}
 */
const sendEmail = async (options) => {
  // If your message contains a reset URL, extract it
  const urlRegex = /(https?:\/\/[^\s"]+)/g;
  const match = options.message.match(urlRegex);
  const resetUrl = match ? match[0] : null;

  // Build a styled HTML message
  const htmlMessage = resetUrl
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
          <a href="${resetUrl}" 
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
    : options.message.replace(/\n/g, "<br/>");

  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message, // plain text fallback
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
