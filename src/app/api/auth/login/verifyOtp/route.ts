





import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; 

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

    return NextResponse.json(
      { message: "Login successful.", role: userRole },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
