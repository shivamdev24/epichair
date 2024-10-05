





import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; 
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const { email, otp } = await request.json(); 
  if (!email || !otp) {
    return NextResponse.json(
      { message: "Email and OTP are required." },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json(
        { message: "OTP has expired." },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { message: "User is not verified." },
        { status: 403 }
      );
    }

    const userRole = user.role;

    const tokenData = { id: user._id, email: user.email };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      { message: "Login successful.", role: userRole , token},
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2592000, // 30d
    });

return response;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
