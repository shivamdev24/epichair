import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // Adjust your User model import as needed
import db from "@/utils/db"; // Your database connection utility
import { generateOtp, getOtpExpiry } from "@/utils/OtpGenerate"; // Import OTP functions
import { sendEmail } from "@/utils/SendEmail"; // Function to send email

db();

// Step 1: Request OTP
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, otp } = body; // Include OTP in the request body

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

    // Step 2: If OTP is not provided, generate and send OTP
    if (!otp) {
      // Generate OTP
      const generatedOtp = generateOtp();
      const otpExpiry = getOtpExpiry(15); // Set expiry time for 10 minutes

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

      return NextResponse.json(
        { message: "OTP sent to your email." },
        { status: 200 }
      );
    }

    // Step 3: If OTP is provided, verify it
    if (otp !== user.otp) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
    }

    // Check if OTP is expired
    if (new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json(
        { message: "OTP has expired. Please request a new one." },
        { status: 401 }
      );
    }

    // Successful login, determine user role
    const userRole = user.role; // Get the user's role

    if (userRole !== "user") {
      return NextResponse.json(
        { message: "Not Authorized For User Login." },
        { status: 403 }
      );
    }
    if (userRole !== "staff") {
      return NextResponse.json(
        { message: "Not Authorized For staff Login." },
        { status: 403 }
      );
    }

    // Respond with user information and role
    return NextResponse.json(
      {
        message: "Login successful.",
        user: {
          email: user.email,
          role: userRole, // Include the role in the response
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Error logging in user", error: error.message },
      { status: 500 }
    );
  }
}
