




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

// Helper function to generate JWT token
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateJwtToken = (user: any) => {
  const tokenData = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
    expiresIn: "1d",
  });
};

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    // Find the user by email in a single query
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Check if OTP is expired or not present
    if (
      !user.otp ||
      (user.otpExpiry && new Date() > new Date(user.otpExpiry))
    ) {
      return NextResponse.json(
        { message: "OTP has expired or not available." },
        { status: 401 }
      );
    }

    // Validate the OTP using bcrypt
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
    }

    // If the user is not yet verified, mark them as verified
    if (!user.isVerified) {
      user.isVerified = true; // Update the isVerified field
      await user.save(); // Save the updated user only if verification changes

      // Generate token for verified user
      const token = generateJwtToken(user);

      const response = NextResponse.json(
        {
          message: "User verified and login successful.",
          role: user.role,
          token,
        },
        { status: 200 }
      );

      // Set the token in cookies
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 day
      });

      return response;
    }

    // For already verified user, just return the token
    const token = generateJwtToken(user);

    const response = NextResponse.json(
      { message: "Login successful.", role: user.role, token },
      { status: 200 }
    );

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
