

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/SendEmail";
import User from "@/models/User";
import db from "@/utils/db";
import { generateOtp, getOtpExpiry } from "@/utils/OtpGenerate";
import bcrypt from "bcryptjs";

db();

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
      if (existingUser.isVerified) {
        return NextResponse.json(
          { message: "User already exists and is verified." },
          { status: 400 }
        );
      } else {
        // Generate new OTP and update the user
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiry = getOtpExpiry(10);

        await User.findByIdAndUpdate(existingUser._id, {
          otp: hashedOtp,
          otpExpiry,
        });

        // Send OTP email
        await sendEmail({
          email,
          emailType: "SIGNUP OTP",
          userId: existingUser._id.toString(),
          otp,
        });

        return NextResponse.json(
          {
            message:
              "User exists but is not verified. A new verification email has been sent.",
          },
          { status: 200 }
        );
      }
    }

    // Generate OTP and expiry for new user
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = getOtpExpiry(10);

    // Create a new user
    const newUser = new User({
      email,
      role: "user", // Set the required role field
      otp: hashedOtp,
      otpExpiry,
    });

    await newUser.save();

    // Send OTP email
    await sendEmail({
      email,
      emailType: "SIGNUP OTP",
      userId: newUser._id.toString(),
      otp,
    });

    return NextResponse.json(
      { message: "OTP sent successfully to your email!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error signing up user:", error);
    return NextResponse.json(
      { message: "Error signing up user", error },
      { status: 500 }
    );
  }
}
