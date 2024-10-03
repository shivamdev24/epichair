


import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; 
import db from "@/utils/db";

db();




export async function GET(request: NextRequest) {
  
  const { searchParams } = request.nextUrl;
  const email = searchParams.get("email"); 

  if (!email) {
    return NextResponse.json(
      { message: "Email is required." },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

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
      { message: "Error retrieving user", error },
      { status: 500 }
    );
  }
}
