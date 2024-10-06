// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/User"; 
// import db from "@/utils/db";
// import { generateOtp, getOtpExpiry } from "@/utils/OtpGenerate";
// import { sendEmail } from "@/utils/SendEmail";
// import bcrypt from 'bcryptjs'

// db();

// export interface IUser {
//   _id: string; 
//   email: string;
//   isVerified: boolean;
//   otp?: string;
//   otpExpiry?: Date;
// }


// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   const { email } = body;

//   if (!email) {
//     return NextResponse.json(
//       { message: "Email is required." },
//       { status: 400 }
//     );
//   }

//   try {



//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       if (existingUser.isVerified) {
//         return NextResponse.json(
//           { message: "User already exists and is verified" },
//           { status: 400 }
//         );
//       } else {
//         const otp = generateOtp();
//         const otpExpiry = getOtpExpiry(10);

//         const hashedOtp = await bcrypt.hash(otp, 10);

//         await User.findByIdAndUpdate(existingUser._id, {
//           hashedOtp,
//           otpExpiry,
//         });

//         await sendEmail({
//           email,
//           emailType: "SIGNUP OTP",
//           userId: existingUser._id.toString(),
//           otp,
//         });

//         return NextResponse.json(
//           {
//             message:
//               "User exists but is not verified. A new verification email has been sent.",
//           },
//           { status: 400 }
//         );
//       }
//     }


//     const user = (await User.findOne({ email })) as IUser | null;

//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

    

//     const otp = generateOtp();
//     const otpExpiry = getOtpExpiry(10); 

//       const hashedOtp = await bcrypt.hash(otp, 10);

//     await User.findByIdAndUpdate(user._id, {
//       otp: hashedOtp,
//       otpExpiry,
//     });

//     await sendEmail({
//       email,
//       emailType: "LOGIN OTP",
//       userId: user._id.toString(),
//       otp,
//     });

    

//     if (!user.isVerified) {
//       return NextResponse.json(
//         { message: "User is not verified." },
//         { status: 403 }
//       );
//     }

//     const response = NextResponse.json(
//       { message: "OTP sent to your email." },
//       { status: 200 }
//     );
    

//     return response;
//   } catch (error) {
//     console.error("Error logging in user:", error);
//     return NextResponse.json(
//       { message: "Error logging in user",  error },
//       { status: 500 }
//     );
//   }
// }






import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import db from "@/utils/db";
import { generateOtp, getOtpExpiry } from "@/utils/OtpGenerate";
import { sendEmail } from "@/utils/SendEmail";
import bcrypt from "bcryptjs";

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
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      

      // Generate and send OTP for non-verified user
      const otp = generateOtp();
      const otpExpiry = getOtpExpiry(10);
      const hashedOtp = await bcrypt.hash(otp, 10);

      // Update user with new OTP and expiry
      await User.findByIdAndUpdate(existingUser._id, {
        otp: hashedOtp, // Ensure this matches your user schema
        otpExpiry,
      });

      await sendEmail({
        email,
        emailType: "LOGIN OTP",
        userId: existingUser._id.toString(),
        otp,
      });

      return NextResponse.json(
        {
          message:
            "User already exists and is verified. A otp email has been sent.",
        },
        { status: 200 } // Change status to 200 for successful operation
      );
    }

    // If the user doesn't exist, handle new user case
    const otp = generateOtp();
    const otpExpiry = getOtpExpiry(10);
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newUser = new User({
      email,
      otp: hashedOtp,
      otpExpiry,
      isVerified: false, // Assuming new users start unverified
    });

    await newUser.save();

    await sendEmail({
      email,
      emailType: "LOGIN OTP",
      userId: newUser._id.toString(),
      otp,
    });

    return NextResponse.json(
      { message: "OTP sent to your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Error logging in user", error },
      { status: 500 }
    );
  }
}
