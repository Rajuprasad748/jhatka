import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.

const email = process.env.EMAIL || "royalmoney10x@gmail.com";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass: "vswbsekjywdnpzxq",
  },
});

// Wrap in an async IIFE so we can use await.
export const sendEmail = async (email , otp) => {
  try {
    const info = await transporter.sendMail({
      from: 'RoyalMoney10X',
      to: email,
      subject: "To change the Password",
      text: `Your OTP for RoyalMoney10x is - ${otp}`, 
    });

    console.log("Message sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
