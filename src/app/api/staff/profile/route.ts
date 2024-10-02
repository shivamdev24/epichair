// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/User"; // Adjust your User model import as needed
// import db from "@/utils/db"; // Your database connection utility

// db();

// export async function GET(request: NextRequest) {
//   // Get query parameters using nextUrl.searchParams
//   const { searchParams } = request.nextUrl;
//   const email = searchParams.get("email"); // Use get() to retrieve query params

//   if (!email) {
//     return NextResponse.json(
//       { message: "Email is required." },
//       { status: 400 }
//     );
//   }

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     // Check if user exists
//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     // Respond with user information
//     return NextResponse.json(
//       {
//         user: {
//           email: user.email,
//           name: user.name,
//           role: user.role,
//           isVerified: user.isVerified,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error retrieving user:", error);
//     return NextResponse.json(
//       { message: "Error retrieving user", error: error.message },
//       { status: 500 }
//     );
//   }
// }






import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // Adjust your User model import as needed
import db from "@/utils/db"; // Your database connection utility

db();

// Utility function to verify the JWT



export async function GET(request: NextRequest) {
  // Authenticate the request
 

  // Get query parameters using nextUrl.searchParams
  const { searchParams } = request.nextUrl;
  const email = searchParams.get("email"); // Use get() to retrieve query params

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

    // Respond with user information
    return NextResponse.json(
      {
        user: {
          email: user.email,
          name: user.username,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { message: "Error retrieving user", error: error.message },
      { status: 500 }
    );
  }
}
