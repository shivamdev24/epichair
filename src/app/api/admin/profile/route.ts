import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import db from "@/utils/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs"

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
    throw new Error("Authorization token is required.");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET || "default_secret_key"
    );

    if (typeof decoded !== "string") {
      return decoded as JwtPayload;
    }
  } catch (error) {
    throw new Error("Invalid token.", { cause: error });
  }
};

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json(
        {
          message: "Authorization is required",
        },
        { status: 401 }
      );
    }

    const email = decoded.email?.toLowerCase(); // Convert email to lowercase

    if (!email) {
      return NextResponse.json(
        { message: "Email is required.", email },
        { status: 400 }
      );
    }

    // Validate email address format
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address format." },
        { status: 400 }
      );
    }

    // Query the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: `User  with email ${email} not found.`, user },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          name: user.username,
          image_url: user.image_url,
          public_id: user.public_id,
          OtpExpiry: user.otpExpiry,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      {
        message: "Error retrieving user",
      },
      { status: 500 }
    );
  }
}

// Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 } // Changed to 400 since user ID is not optional
      );
    }

    // Optionally, you can also validate if the user exists before deleting
    const user = await User.findById(userId); // Check if user exists

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Delete the user by ID
    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      { message: "User account deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        message: "Error deleting user",
        error 
      },
      { status: 500 }
    );
  }
}

// export async function PUT(request: NextRequest) {
//   try {
//     const decoded = verifyToken(request);

//     if (!decoded) {
//       return NextResponse.json(
//         {
//           message: "Authorization is required",
//         },
//         { status: 401 }
//       );
//     }

//     const userId = decoded.id; // Extract user ID from decoded token
//     const email = decoded.email?.toLowerCase(); // Extract email from decoded token

//     // Validate user ID and email
//     if (!userId) {
//       return NextResponse.json(
//         { message: "User ID is required." },
//         { status: 400 }
//       );
//     }

//     if (!email) {
//       return NextResponse.json(
//         { message: "Email is required." },
//         { status: 400 }
//       );
//     }

//     if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
//       return NextResponse.json(
//         { message: "Invalid email address format." },
//         { status: 400 }
//       );
//     }

//     const { name, password } = await request.json();

//     if (!name) {
//       return NextResponse.json(
//         { message: "Name is required." },
//         { status: 400 }
//       );
//     }

//     // Find the user by ID
//     const user = await User.findById(userId);

//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     // Update user information
//     user.username = name;
//     user.password = password;

//     await user.save();

//     return NextResponse.json(
//       {
//         message: "User information updated successfully.",
//         user: {
//           email: user.email,
//           name: user.username,
//           password: user.password,
//           role: user.role,
//           isVerified: user.isVerified,
//         },
//       },
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




export async function PATCH(request: NextRequest) {
  try {
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json(
        { message: "Authorization is required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id"); // Get the user ID from query parameters

    // Validate the ID
    if (!(userId && typeof userId === "string")) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const email = decoded.email?.toLowerCase(); // Extract email from decoded token

    // Validate user ID and email
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address format." },
        { status: 400 }
      );
    }

    const updateData = await request.json(); // Parse the request body

    // Find the user by ID
    const user = await User.findById(userId); // Use userId here

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Update user information only for provided fields in the request body
    if (updateData.username) {
      // Correct field name to 'username'
      user.username = updateData.username;
    }

    // Check if a new password was provided
    if (updateData.password) {
      // Hash the new password before saving it
      const saltRounds = 10; // Adjust the salt rounds as needed
      const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
      user.password = hashedPassword; // Update user password with the hashed password
    }

    await user.save(); // Save the updated user document

    return NextResponse.json(
      {
        message: "User information updated successfully.",
        user: {
          email: user.email,
          username: user.username, // Ensure the updated username is returned
          role: user.role,
          isVerified: user.isVerified,
        },
      },
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