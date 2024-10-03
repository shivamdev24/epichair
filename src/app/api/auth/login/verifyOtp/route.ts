// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/User"; // Adjust your User model import as needed
// import db from "@/utils/db";

// db(); // Ensure that your database connection is established

// export async function POST(request: NextRequest) {
//   const { searchParams } = new URL(request.url); // Get URL search parameters
//   const email = searchParams.get("email");

//   console.log("Full URL:", request.url); // Log the full URL
//   console.log("Email from URL:", email); // Log the email

//   const body = await request.json();
//   const { otp } = body; // OTP is still taken from the request body

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     // Check if the OTP is valid and not expired
//     const isOtpValid = otp === user.otp; // Direct comparison of OTPs
//     const isOtpExpired = Date.now() > user.otpExpiry; // No need to call getTime() if otpExpiry is a timestamp

//     if (!isOtpValid) {
//       return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
//     }

//     if (isOtpExpired) {
//       return NextResponse.json(
//         { message: "OTP has expired." },
//         { status: 400 }
//       );
//     }

//     // OTP is valid and not expired, mark user as verified
//     // Check user role
//         const userRole = user.role;

//         // Respond with success and user role
//         return NextResponse.json(
//           { message: "Login successful.", role: userRole },
//           { status: 200 }
//         );

//     // console.log("login successfull");

//     // return NextResponse.json(
//     //   { message: "Login successfully!" },
//     //   { status: 200 }
//     // );
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return NextResponse.json(
//       { message: "Error verifying OTP", error },
//       { status: 500 }
//     );
//   }
// }














// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/User"; // Adjust as per your model

// export async function POST(request: NextRequest) {
//   // Extracting email from cookies
//   const email = request.cookies.get("email")?.value;

//   // Log the email for debugging
//   console.log("Email from cookie:", email);

//   const { otp } = await request.json(); // Ensure you're reading both email and OTP from the request body

//   if (!email || !otp) {
//     return NextResponse.json(
//       { message: "Email and OTP are required." },
//       { status: 400 }
//     );
//   }

//   if (!otp) {
//     return NextResponse.json({ message: "OTP is required." }, { status: 400 });
//   }

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     // Check if user exists
//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     // Check OTP and expiry
//     if (user.otp !== otp) {
//       return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
//     }

//     if (new Date() > new Date(user.otpExpiry)) {
//       return NextResponse.json(
//         { message: "OTP has expired." },
//         { status: 401 }
//       );
//     }

//     // Successful OTP verification, check if the user is verified
//     if (!user.isVerified) {
//       return NextResponse.json(
//         { message: "User is not verified." },
//         { status: 403 }
//       );
//     }

//     // Check user role
//     const userRole = user.role;

//     // Respond with success and user role
//     return NextResponse.json(
//       { message: "Login successful.", role: userRole },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }






import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // Adjust as per your model

export async function POST(request: NextRequest) {
  const { email, otp } = await request.json(); // Get email and OTP from the body

  if (!email || !otp) {
    return NextResponse.json(
      { message: "Email and OTP are required." },
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

    // Check OTP and expiry
    if (user.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json(
        { message: "OTP has expired." },
        { status: 401 }
      );
    }

    // Successful OTP verification, check if the user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { message: "User is not verified." },
        { status: 403 }
      );
    }

    // Check user role
    const userRole = user.role;

    // Respond with success and user role
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
