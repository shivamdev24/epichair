import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // Adjust your User model import as needed
import db from "@/utils/db";

db(); // Ensure that your database connection is established

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url); // Get URL search parameters
  const email = searchParams.get("email");

  console.log("Full URL:", request.url); // Log the full URL
  console.log("Email from URL:", email); // Log the email

  const body = await request.json();
  const { otp } = body; // OTP is still taken from the request body

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Check if the OTP is valid and not expired
    const isOtpValid = otp === user.otp; // Direct comparison of OTPs
    const isOtpExpired = Date.now() > user.otpExpiry.getTime(); // No need to call getTime() if otpExpiry is a timestamp

    if (!isOtpValid) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
    }

    if (isOtpExpired) {
      return NextResponse.json(
        { message: "OTP has expired." },
        { status: 400 }
      );
    }

    // OTP is valid and not expired, mark user as verified
   
   
    console.log("login successfull")

    return NextResponse.json(
      { message: "Login successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Error verifying OTP", error },
      { status: 500 }
    );
  }
}
