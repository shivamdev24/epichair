import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; 
import db from "@/utils/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 

db(); 

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  const body = await request.json();
  const { otp } = body; 

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const isOtpExpired = new Date() > user.otpExpiry;

    if (isOtpExpired) {
      return NextResponse.json(
        { message: "OTP has expired." },
        { status: 400 }
      );
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
    }

    const tokenSecret = process.env.TOKEN_SECRET || "default_secret_key";
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
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Error verifying OTP", error },
      { status: 500 }
    );
  }
}
