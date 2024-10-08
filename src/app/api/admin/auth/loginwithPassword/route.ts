// app/api/admin/auth/loginwithPassword/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import db from "@/utils/db";

// Connect to the database
db();

// Handle POST request
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const hashedPassword = existingUser.password;
    if (!hashedPassword) {
      return NextResponse.json(
        { message: "User password not found." },
        { status: 500 } // Internal Server Error
      );
    }

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!existingUser.isVerified) {
      return NextResponse.json(
        { message: "User is not verified. Please check your email." },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.TOKEN_SECRET!,
      { expiresIn: "24h" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful.",
        token,
      },
      { status: 200 }
    );

 
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 30d
    });

    
    return response;
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { message: "Error logging in user", error },
      { status: 500 }
    );
  }
}
