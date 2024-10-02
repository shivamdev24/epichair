


// import { NextRequest, NextResponse } from "next/server";
// import { sendEmail } from "@/utils/SendEmail"; // Adjust your import path
// import User from "@/models/User"; // Adjust your User model import as needed
// import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
// import db from "@/utils/db";
// import { generateOtp, getOtpExpiry } from "@/utils/OtpGenerate"; // Import OTP functions

// db();

// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   const { email, password } = body;

//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       if (existingUser.isVerified) {
//         return NextResponse.json(
//           { message: "User already exists and is verified" },
//           { status: 400 }
//         );
//       } else {
//         // Optionally: Send a verification email again if the user is not verified
//         const otp = generateOtp(); // Generate an OTP
//         const otpExpiry = getOtpExpiry(10); // Set expiry time for 10 minutes

//         // Update user with new OTP and expiry
//         await User.findByIdAndUpdate(existingUser._id, {
//           otp,
//           otpExpiry,
//         });

//         await sendEmail({
//           email,
//           emailType: "SIGNUP OTP",
//           userId: existingUser._id.toString(), // Ensure you're using the existing user's ID
//           otp, // Pass the generated OTP
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

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({ email, password: hashedPassword }); // Add any other fields required
//     await newUser.save();

//     // Generate OTP for the new user
//     const otp = generateOtp(); // Generate an OTP
//     const otpExpiry = getOtpExpiry(10); // Set expiry time for 10 minutes

//     // Update user with OTP and expiry
//     await User.findByIdAndUpdate(newUser._id, {
//       otp,
//       otpExpiry,
//     });

//     // Send confirmation email
//     await sendEmail({
//       email,
//       emailType: "SIGNUP OTP",
//       userId: newUser._id.toString(),
//       otp, // Pass the generated OTP
//     });

//     return NextResponse.json(
//       { message: "User registered successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error signing up user:", error);
//     return NextResponse.json(
//       { message: "Error signing up user", error: error.message },
//       { status: 500 }
//     );
//   }
// }





















