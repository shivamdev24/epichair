import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/SendEmail";
import User from "@/models/User";
import db from "@/utils/db";
import { getOtpExpiry } from "@/utils/OtpGenerate";
import jwt from 'jsonwebtoken'

db();
const verifyToken = (request: NextRequest) => {
  const authHeader = request.headers.get("Authorization");
  let token: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = request.cookies.get("token")?.value || null;
  }

  if (!token) {
    console.warn("No authorization token found.");
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET || "default_secret_key"
    );

    if (typeof decoded !== "string") {
      return decoded; // Return the decoded JWT payload (full info)
    } else {
      throw new Error("Invalid token payload.");
    }
  } catch (error) {
    console.error("Token verification error:", { cause: error });
    return null;
  }
};


// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   const { email, name, service } = body; // Note: changed 'service' to 'services' to match your JSON

//   // Validate required fields
//   if (!email || !name || !service) {
//     return NextResponse.json(
//       { message: "Email, name, skills, and services are required." },
//       { status: 400 }
//     );
//   }

//   try {
//     // Verify the token before proceeding
//     const userData = verifyToken(request);

//     if (!userData) {
//       return NextResponse.json(
//         { message: "Unauthorized access. Invalid or missing token." },
//         { status: 401 }
//       );
//     }
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       if (existingUser.isVerified) {
//         return NextResponse.json(
//           { message: "User already exists and is verified" },
//           { status: 400 }
//         );
//       }
//     }
//     const otpExpiry = getOtpExpiry(10);

//     // Create a new user
//     const newUser = new User({
//       email,
//       role: "staff", // Set the required role field
//       isVerified: true,
//       username: name,
//       service,
//       otpExpiry,
//     });

//     await newUser.save();

//     // Send OTP email
//     await sendEmail({
//       email,
//       emailType: "SIGNUP BY ADMIN",
//       userId: newUser._id.toString(),
//     });

//     return NextResponse.json(
//       { message: "Signup by admin successfully !" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error signing up user:", error);
//     return NextResponse.json(
//       { message: "Error signing up user", error}, // Return only the error message
//       { status: 500 }
//     );
//   }
// }


export async function POST(request: NextRequest) {
  

  try {



    // Verify the token before proceeding
    const userData = verifyToken(request);

    if (!userData) {
      return NextResponse.json(
        { message: "Unauthorized access. Invalid or missing token." },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { email, username, services } = body; // Updated 'service' to 'services' and added 'skills'

    // Validate required fields
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { message: "User already exists and is verified" },
          { status: 400 }
        );
      }
    }

    const otpExpiry = getOtpExpiry(10);

    // Create a new user
    const newUser = new User({
      email,
      role:  "staff", // Set the required role field
      isVerified: true,
      username,
       // Add skills to the user model
      services, // Change to services
      otpExpiry,
    });

    await newUser.save();

    // Send OTP email
    await sendEmail({
      email,
      emailType: "SIGNUP BY ADMIN",
      userId: newUser._id.toString(),
    });

    return NextResponse.json(
      { message: "Signup by admin successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error signing up user:", error);
    return NextResponse.json(
      { message: "Error signing up user", error }, // Return only the error message
      { status: 500 }
    );
  }
}




export async function GET(request: NextRequest) {
  // Verify the token before proceeding
  const userData = verifyToken(request);

  if (!userData) {
    return NextResponse.json(
      { message: "Unauthorized access. Invalid or missing token." },
      { status: 401 }
    );
  }

  try {
    // Query to get all users with role 'staff'
    const staffUsers = await User.find({ role: "staff" });
    // console.log(staffUsers)

    return NextResponse.json({ staff: staffUsers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching staff users:", error);
    return NextResponse.json(
      { message: "Error fetching staff users", error },
      { status: 500 }
    );
  }
}




export async function PUT(request: NextRequest) {


   const url = new URL(request.url);
   const userId = url.searchParams.get("id");

  const body = await request.json();
  const {  username,  services } = body;

  // Validate required fields
  

  try {
    // Verify the token before proceeding
    const userData = verifyToken(request);

    if (!userData) {
      return NextResponse.json(
        { message: "Unauthorized access. Invalid or missing token." },
        { status: 401 }
      );
    }

    // Find the existing user by email
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update the user's details
    existingUser.username = username;
    existingUser.services = services;

    await existingUser.save();

    console.log(existingUser);

    return NextResponse.json(
      { message: "User updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user", error },
      { status: 500 }
    );
  }
}

// export async function PATCH(request: NextRequest) {
//   const url = new URL(request.url);
//   const userId = url.searchParams.get("id");

//   const body = await request.json();
//   const { email, name, skills, services } = body;

//   // Validate required fields
//   if (!email || !name || !skills || !services) {
//     return NextResponse.json(
//       { message: "Email, name, skills, and services are required." },
//       { status: 400 }
//     );
//   }

//   try {
//     // Verify the token before proceeding
//     const userData = verifyToken(request);

//     if (!userData) {
//       return NextResponse.json(
//         { message: "Unauthorized access. Invalid or missing token." },
//         { status: 401 }
//       );
//     }

//     // Find the existing user by ID
//     const existingUser = await User.findById(userId);

//     if (!existingUser) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     // Update the user's details
//     existingUser.username = name;
//     existingUser.email = email; // Make sure to update the email
//     existingUser.services = services;

//     await existingUser.save();

//     return NextResponse.json(
//       { message: "User updated successfully!" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return NextResponse.json(
//       { message: "Error updating user", error },
//       { status: 500 }
//     );
//   }
// }







export async function DELETE(request: NextRequest) {
  // Verify the token before proceeding
  const userData = verifyToken(request);

  if (!userData) {
    return NextResponse.json(
      { message: "Unauthorized access. Invalid or missing token." },
      { status: 401 }
    );
  }

  // Only allow admins to delete users
  if (userData.role !== "admin") {
    return NextResponse.json(
      { message: "Unauthorized access. Admin privileges required." },
      { status: 403 }
    );
  }

  const url = new URL(request.url);
  const userId = url.searchParams.get("id");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    // Find and delete the user with the provided ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user", error },
      { status: 500 }
    );
  }
}