


import nodemailer from "nodemailer";
import User from "@/models/User";

interface SendEmailParams {
  email: string;
  emailType: "SIGNUP OTP" | "LOGIN OTP" | "RESET";
  userId: string;
  otp?: string;
}
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({
  email,
  emailType,
  userId,
  otp
}: SendEmailParams) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
   
    const updatedUser = await User.findByIdAndUpdate(userId);
    if (!updatedUser) {
      throw new Error("User not found");
    }

    const subject =
      emailType === "SIGNUP OTP" || emailType === "LOGIN OTP"
        ? "Verify Your Email"
        : "Reset Your Password";

    const htmlContent = `
      <p>your ${emailType} is ${otp} expiry time for OTP 10 minutes
      </p>`;

    const mailOptions = {
      from: {
        address: "owner@gmail.com", 
        name: "Your Name", 
      },
      to: email, 
      subject, 
      
      html: htmlContent, 
    };

    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Mail sent successfully:", mailResponse);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error sending email: ${error}`);
  }
};
