import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import db from "@/utils/db";
import jwt, { JwtPayload } from "jsonwebtoken";

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

    if (typeof decoded !== "string" && (decoded as JwtPayload).id) {
      return (decoded as JwtPayload).id; // Return user ID or any relevant data
    } else {
      throw new Error("Invalid token payload.");
    }
  } catch (error) {
    throw new Error("Invalid token.", { cause: error });
  }
};

// Retrieve user information by email
export async function GET(request: NextRequest) {

  const userId = verifyToken(request);

  if (!userId) {
    return NextResponse.json(
      {
        message: "Authorization Is Required",
      },
      { status: 401 }
    );
  }


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

// Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const userId = verifyToken(request);

    if (!userId) {
      return NextResponse.json(
        {
          message: "Authorization Is Required",
        },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User account deleted successfully." },
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



export async function PUT(request: NextRequest) {
  try {
    const userId = verifyToken(request); 

    if(!userId){
      return NextResponse.json(
        {
          message: "Authorization Is Required",
        },
        { status: 401 }
      );
    }



    const { email, name, } = await request.json(); 

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findById(userId); // Find the user by ID

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    user.username = name;

    await user.save(); 

    return NextResponse.json(
      {
        message: "User information updated successfully.",
        user: {
          name: user,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user",  error },
      { status: 500 }
    );
  }
}