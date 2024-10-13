


import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import db from "@/utils/db";
import { generateOtp, getOtpExpiry } from "@/utils/OtpGenerate";
import { sendEmail } from "@/utils/SendEmail";
import bcrypt from "bcryptjs";

db();

export interface IUser {
  _id: string;
  email: string;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json(
      { message: "Email is required." },
      { status: 400 }
    );
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      
      

      // Generate and send OTP for non-verified user
      const otp = generateOtp();
      const otpExpiry = getOtpExpiry(10);
      const hashedOtp = await bcrypt.hash(otp, 10);

      // Update user with new OTP and expiry
      await User.findByIdAndUpdate(existingUser._id, {
        otp: hashedOtp, // Ensure this matches your user schema
        otpExpiry,
      });

      await sendEmail({
        email,
        emailType: "LOGIN OTP",
        userId: existingUser._id.toString(),
        otp,
      });

      return NextResponse.json(
        {
          message:
            "User already exists and is verified. A otp email has been sent.",
        },
        { status: 200 } // Change status to 200 for successful operation
      );
    }

    // If the user doesn't exist, handle new user case
    const otp = generateOtp();
    const otpExpiry = getOtpExpiry(10);
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newUser = new User({
      email,
      otp: hashedOtp,
      otpExpiry,
      isVerified: false, // Assuming new users start unverified
    });

    await newUser.save();

    await sendEmail({
      email,
      emailType: "LOGIN OTP",
      userId: newUser._id.toString(),
      otp,
    });

    return NextResponse.json(
      { message: "OTP sent to your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Error logging in user", error },
      { status: 500 }
    );
  }
}
