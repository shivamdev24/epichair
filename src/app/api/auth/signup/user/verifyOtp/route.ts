



import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import db from "@/utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

db();

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  console.log("Full URL:", request.url);
  console.log("Email from URL:", email);

  const body = await request.json();
  const { otp } = body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Check if the OTP has expired
    const isOtpExpired = Date.now() > user.otpExpiry.getTime();
    if (isOtpExpired) {
      return NextResponse.json(
        { message: "OTP has expired." },
        { status: 400 }
      );
    }

    // Compare the OTP with the hashed OTP stored in the database
    const isOtpValid = await bcrypt.compare(otp.trim(), user.otp);
    if (isOtpValid) {
      return NextResponse.json(
        { message: "Invalid OTP. Please try again.", isOtpValid },
        { status: 400 }
      );
    }

    // Mark user as verified and save
    user.isVerified = true;
    try {
      await user.save();
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { message: "Error updating user." },
        { status: 500 }
      );
    }

    console.log("Signup successful");

    // Create a token for the user
    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
      console.error("TOKEN_SECRET environment variable is not set.");
      return NextResponse.json(
        { message: "Internal Server Error." },
        { status: 500 }
      );
    }

    try {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        tokenSecret,
        { expiresIn: "90d" }
      );

      return NextResponse.json(
        { message: "Signup successful!", token },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error creating token:", error);
      return NextResponse.json(
        { message: "Error creating token." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Error verifying OTP." },
      { status: 500 }
    );
  }
}
