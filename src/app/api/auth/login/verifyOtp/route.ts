




// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/User";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// export async function POST(request: NextRequest) {
//   const { email, otp } = await request.json();
//   if (!email || !otp) {
//     return NextResponse.json(
//       { message: "Email and OTP are required." },
//       { status: 400 }
//     );
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     if (user.otpExpiry && new Date() > new Date(user.otpExpiry)) {
//       return NextResponse.json(
//         { message: "OTP has expired." },
//         { status: 401 }
//       );
//     }

// if (!user.otp) {
//   return NextResponse.json(
//     { message: "OTP is not available." },
//     { status: 400 }
//   );
// }

// const isOtpValid = await bcrypt.compare(otp, user.otp);


//     if (!isOtpValid) {
//       return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
//     }

//     // If the user is already verified
//     if (!user.isVerified) {
//       // Mark user as verified
//       user.isVerified = true; // Update the isVerified field
//       await user.save(); // Save the updated user


//       const tokenData = { id: user._id, email: user.email, role: user.role };
//       const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
//         expiresIn: "1d",
//       });

//       const response = NextResponse.json(
//         { message: "User is Verified and Login successfully.", role: user.role, token },
//         { status: 200 }
//       );

//       response.cookies.set("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 86400, // 30d
//       });

//       return response;
//     }


//     const tokenData = { id: user._id, email: user.email, role: user.role };
//     const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
//       expiresIn: "1d"
//     });

//     const response = NextResponse.json(
//       { message: "Login successful.", role: user.role, token },
//       { status: 200 }
//     );

//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 86400, // 30d
//     });

//     return response;
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
















import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "@/utils/db";

db();

export async function POST(request: NextRequest) {
  const { email, otp } = await request.json();

  // Check required fields
  if (!email || !otp) {
    return NextResponse.json(
      { message: "Email and OTP are required." },
      { status: 400 }
    );
  }

  try {
    // Optimize by selecting only the required fields
    const user = await User.findOne({ email }).select(
      "otp otpExpiry isVerified role"
    );
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Check OTP expiry
    if (user.otpExpiry && new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json(
        { message: "OTP has expired." },
        { status: 401 }
      );
    }

    // Check if OTP is available
    if (!user.otp) {
      return NextResponse.json(
        { message: "OTP is not available." },
        { status: 400 }
      );
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
    }

    // If the user is already verified
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Generate JWT token
    const tokenData = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        message: "User is Verified and Login successfully.",
        role: user.role,
        token,
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
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
