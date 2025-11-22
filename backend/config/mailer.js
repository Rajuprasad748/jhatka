// import nodemailer from "nodemailer";
// import dotenv from 'dotenv';
// dotenv.config();

// // OR if using CommonJS:
// // require('dotenv').config();

// const email = process.env.EMAIL_USER;
// const password = process.env.EMAIL_APP_PASSWORD; 

// if(!email || !password) {
//   console.error("❌ Email configuration error: Something went wrong , missing Environments");
// }

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587, // Changed from 465 to 587 (more reliable)
//   secure: false, // false for port 587, true for 465
//   auth: {
//     user: email,
//     pass: password,
//   },
//   tls: {
//     rejectUnauthorized: process.env.NODE_ENV === 'production'
//   }
// });

// // Verify connection on startup
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Email configuration error:", error.message);
//   } else {
//     console.log("✅ Email server is ready to send emails" , success);
//   }
// });

// export const sendEmail = async (recipientEmail, otp) => {
//   try {

//     if(!recipientEmail) {
//       throw new Error("Recipient email is required");
//     }

//     if(!otp) {
//       throw new Error("OTP is required");
//     };
    
//     const info = await transporter.sendMail({
//       from: `"RoyalMoney10X" <${email}>`, // Better format
//       to: recipientEmail,
//       subject: "Password Reset OTP - RoyalMoney10X",
//       text: `Your OTP for RoyalMoney10x is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">Password Reset Request</h2>
//           <p>Your OTP for <strong>RoyalMoney10X</strong> is:</p>
//           <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
//             ${otp}
//           </div>
//           <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>.</p>
//           <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
//         </div>
//       `
//     });

//     console.log("✅ Email sent successfully:", info.messageId);
//     return true;
//   } catch (error) {
//     console.error("❌ Error sending email:", error.message);
//     console.error("Full error:", error);
//     return false;
//   }
// };


import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const email = process.env.EMAIL_USER || "RoyalMoney10X <onboarding@resend.dev>";

export const sendEmail = async (recipientEmail, otp) => {
  try {
    if (!recipientEmail) {
      throw new Error("Recipient email is required");
    }

    if (!otp) {
      throw new Error("OTP is required");
    }

    const { data, error } = await resend.emails.send({
      from: email, 
      to: recipientEmail,
      subject: "Password Reset OTP - RoyalMoney10X",

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Your OTP for <strong>RoyalMoney10X</strong> is:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Error sending email:", error);
      return false;
    }

    console.log("✅ Email sent successfully:", data?.id);
    return true;

  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return false;
  }
};
