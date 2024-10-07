import nodemailer from "nodemailer";
import User from "@/models/User";

interface SendEmailParams {
  email: string;
  emailType: "SIGNUP OTP" | "LOGIN OTP" | "RESET" | "SIGNUP BY ADMIN";
  userId: string;
  otp?: string;
}

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({
  email,
  emailType,
  userId,
  otp,
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
      emailType === "SIGNUP BY ADMIN" ||
      emailType === "SIGNUP OTP" ||
      emailType === "LOGIN OTP" 
        ? "Verify Your Email"
        : "Reset Your Password";

   let htmlContent: string;
   switch (emailType) {
     case "SIGNUP OTP":
       htmlContent = `<p>Your signup OTP is <strong>${otp}</strong>. The expiry time for the OTP is 10 minutes.</p>`;
       break;
     case "LOGIN OTP":
       htmlContent = `<p>Your login OTP is <strong>${otp}</strong>. The expiry time for the OTP is 10 minutes.</p>`;
       break;
     case "RESET":
       htmlContent = `<p>You requested to reset your password. Use the following code: <strong>${otp}</strong>. The expiry time for this code is 10 minutes.</p>`;
       break;
     case "SIGNUP BY ADMIN":
       htmlContent = `<p>Your account has been created by an admin.</p>`;
       break;
     default:
       throw new Error("Invalid email type");
   }


    const mailOptions = {
      from: {
        address: "owner@gmail.com",
        name: "Epic Hair",
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
