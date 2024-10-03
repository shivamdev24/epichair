import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/SendEmail";
import User from "@/models/User";
import db from "@/utils/db";
import { generateOtp, getOtpExpiry } from "@/utils/OtpGenerate";

db();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, role } = body;

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
          { message: "User already exists and is verified" },
          { status: 400 }
        );
      } else {
        const otp = generateOtp();
        const otpExpiry = getOtpExpiry(10);

        await User.findByIdAndUpdate(existingUser._id, {
          otp,
          otpExpiry,
        });

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
          { status: 400 }
        );
      }
    }

    const otp = generateOtp();
    const otpExpiry = getOtpExpiry(10);

    const newUser = new User({
      email,
      role: role || "admin",
      otp: otp,
      otpExpiry: otpExpiry,
    });

    await newUser.save();

    await User.findByIdAndUpdate(newUser._id, {
      otp,
      otpExpiry,
    });

    await sendEmail({
      email,
      emailType: "SIGNUP OTP",
      userId: newUser._id.toString(),
      otp,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
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
