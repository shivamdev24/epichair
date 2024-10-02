// import db from "@/utils/db";
// import {  NextResponse } from "next/server";

// db();

// export async function POST() {
//   try {
//     const response = NextResponse.json({
//       message: "Logout Successfully",
//       success: true,
//     });

//     response.cookies.set("token", "", {
//       httpOnly: true,
//       expires: new Date(0),
//     });

//     console.log(response);
//     return response;
//   } catch (error) {
//     console.error("Error during registration:", error);
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }






import db from "@/utils/db";
import { NextResponse } from "next/server";

db();

export async function POST() {
  try {
    // Create a response object
    const response = NextResponse.json({
      message: "Logout Successfully",
      success: true,
    });

    // Clear the token cookie by setting it with an expiration date in the past
    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/", // Ensure the cookie path is set to root
      expires: new Date(0), // Expire the cookie immediately
    });

    // Optional: Log the response for debugging
    console.log("Logout response:", response);

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
