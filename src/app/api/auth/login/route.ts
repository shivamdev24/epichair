import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; 
import db from "@/utils/db"; 
import { generateOtp, getOtpExpiry } from "@/utils/OtpGenerate"; 
import { sendEmail } from "@/utils/SendEmail"; 
import jwt from "jsonwebtoken"



db();

// Step 1: Request OTP
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body; // Include OTP in the request body

  // Check if all required fields are provided
  if (!email) {
    return NextResponse.json(
      { message: "Email is required." },
      { status: 400 }
    );
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { message: "User is not verified." },
        { status: 403 }
      );
    }

    // Generate OTP
    const generatedOtp = generateOtp();
    const otpExpiry = getOtpExpiry(10); // Set expiry time for 10 minutes

    // Update user with the OTP and expiry
    await User.findByIdAndUpdate(user._id, {
      otp: generatedOtp,
      otpExpiry,
    });

    // Send the OTP to the user via email
    await sendEmail({
      email,
      emailType: "LOGIN OTP",
      userId: user._id.toString(),
      otp: generatedOtp, // Pass the generated OTP
    });

    // Generate and set a token (optional, based on your flow)
    const tokenData = { id: user._id, email: user.email };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      { message: "OTP sent to your email." },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2592000, // 30d 
    });

    return response;
  }
 catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Error logging in user", error: error.message },
      { status: 500 }
    );
  }
}
