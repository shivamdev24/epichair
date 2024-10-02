import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/SendEmail";
import User from "@/models/User";
import db from "@/utils/db";
import { generateOtp, getOtpExpiry } from "@/utils/OtpGenerate";

db();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, role } = body; // Include role in the request body

  // Check if all required fields are provided
  if (!email) {
    return NextResponse.json(
      { message: "Email is required." },
      { status: 400 }
    );
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { message: "User already exists and is verified" },
          { status: 400 }
        );
      } else {
        // Resend OTP logic for unverified user
        const otp = generateOtp(); // Generate a new OTP
        const otpExpiry = getOtpExpiry(10); // Set expiry time for 10 minutes

        // Update user with new OTP and expiry
        await User.findByIdAndUpdate(existingUser._id, {
          otp,
          otpExpiry,
        });

        // Send the OTP to the user via email
        await sendEmail({
          email,
          emailType: "SIGNUP OTP",
          userId: existingUser._id.toString(),
          otp, // Pass the generated OTP
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

    // Create a new user with the specified role or default to "staff"
    const newUser = new User({
      email,
      role: role || "staff", // Allow role to be specified, default to "staff"
      otp: otp, // Initially, set OTP to null
      otpExpiry: otpExpiry, // Initially, set OTP expiry to null
    });

    await newUser.save();

    // Generate OTP for the new user
    const otp = generateOtp(); // Generate an OTP
    const otpExpiry = getOtpExpiry(10); // Set expiry time for 10 minutes

    // Update user with OTP and expiry
    await User.findByIdAndUpdate(newUser._id, {
      otp,
      otpExpiry,
    });

    // Send confirmation email
    await sendEmail({
      email,
      emailType: "SIGNUP OTP",
      userId: newUser._id.toString(),
      otp, // Pass the generated OTP
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error signing up user:", error);
    return NextResponse.json(
      { message: "Error signing up user", error: error.message },
      { status: 500 }
    );
  }
}
