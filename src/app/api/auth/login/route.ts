import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; 
import db from "@/utils/db";
import { generateOtp, getOtpExpiry } from "@/utils/OtpGenerate";
import { sendEmail } from "@/utils/SendEmail";


db();

export interface IUser {
  _id: string; 
  email: string;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
}


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
    const user = (await User.findOne({ email })) as IUser | null;

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    

    const generatedOtp = generateOtp();
    const otpExpiry = getOtpExpiry(10); 

    await User.findByIdAndUpdate(user._id, {
      otp: generatedOtp,
      otpExpiry,
    });

    await sendEmail({
      email,
      emailType: "LOGIN OTP",
      userId: user._id.toString(),
      otp: generatedOtp,
    });

    

    if (!user.isVerified) {
      return NextResponse.json(
        { message: "User is not verified." },
        { status: 403 }
      );
    }

    const response = NextResponse.json(
      { message: "OTP sent to your email." },
      { status: 200 }
    );
    

    return response;
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Error logging in user",  error },
      { status: 500 }
    );
  }
}
