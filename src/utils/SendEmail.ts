


import nodemailer from "nodemailer";
import User from "@/models/User";

interface SendEmailParams {
  email: string;
  emailType: "SIGNUP OTP" | "LOGIN OTP" | "RESET";
  userId: string;
  otp?: string;
}
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "daebe971fa300e",
    pass: "c01b64cb439d37",
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
