// import { generateOtp } from '@/utils/otpGenerator';
// import nodemailer from "nodemailer";
// import bcryptjs from "bcryptjs";
// import User from "@/models/User";

// interface SendEmailParams {
//   email: string;
//   emailType: "SIGNUP OTP" | "LOGIN OTP" | "RESET";
//   userId: string;
//   otp: string;
// }

// // Create a transport using SMTP with your Gmail credentials
// const transport = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "daebe971fa300e",
//     pass: "c01b64cb439d37",
//   },
// });

// export const sendEmail = async ({
//   email,
//   emailType,
//   userId,
// }: SendEmailParams) => {
//   try {
//     // Hash the userId to create a token
//     const hashedToken = await bcryptjs.hash(userId.toString(), 10);

//     // Prepare update data
//     const updateData = {
//       otp: hashedToken,
//       otpExpiry: Date.now() + 3600000, // 1 hour from now
//     };

//     // Update user with appropriate token
//     await User.findByIdAndUpdate(userId, updateData);

//     const subject =
//       emailType === "SIGNUP OTP" || emailType === "LOGIN OTP"
//         ? "Verify Your Email"
//         : "Reset Your Password";

//     const htmlContent = `
//       <p>Click <a href="${
//         process.env.DOMAIN
//       }/verifyemail?token=${hashedToken}" target="_blank" rel="noopener noreferrer">Here</a> to ${
//       emailType === "RESET" ? "reset your password" : "verify your email"
//     } or copy and paste the link below in your browser
//       <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
//       </p>`;

//     const mailOptions = {
//       from: {
//         address: "clevercode.connect@gmail.com", // Your Gmail address
//         name: "Your Name", // Your name or business name
//       },
//       to: email, // Recipient's email
//       subject, // Subject line
//       text: `Click the link to ${
//         emailType === "RESET" ? "reset your password" : "verify your email"
//       }: ${process.env.DOMAIN}/verifyemail?token=${hashedToken}`, // Plain text body
//       html: htmlContent, // HTML body
//     };

//     const mailResponse = await transport.sendMail(mailOptions);
//     console.log("Mail sent successfully:", mailResponse);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Error sending email");
//   }
// };




import nodemailer from "nodemailer";
import User from "@/models/User";

interface SendEmailParams {
  email: string;
  emailType: "SIGNUP OTP" | "LOGIN OTP" | "RESET";
  userId: string;
  otp?: string; // Optional, since we are generating it internally
}

// Create a transport using SMTP with your Mailtrap credentials
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
    // Hash the userId to create a token
    

    // Prepare update data
    

    // Update user with appropriate token
    const updatedUser = await User.findByIdAndUpdate(userId);
    if (!updatedUser) {
      throw new Error("User not found");
    }

    const subject =
      emailType === "SIGNUP OTP" || emailType === "LOGIN OTP"
        ? "Verify Your Email"
        : "Reset Your Password";

    const htmlContent = `
      <p>your ${emailType} otp is ${otp}
      </p>`;

    const mailOptions = {
      from: {
        address: "clevercode.connect@gmail.com", // Your Gmail address
        name: "Your Name", // Your name or business name
      },
      to: email, // Recipient's email
      subject, // Subject line
      
      html: htmlContent, // HTML body
    };

    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Mail sent successfully:", mailResponse);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error sending email: ${error}`);
  }
};
