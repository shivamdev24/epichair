import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import db from "@/utils/db";
import { verifyToken } from "@/utils/Token";

db();



// GET all staff members
export async function GET(request: NextRequest) {
  try {
    verifyToken(request); // Ensure the token is verified

    // Retrieve all users with a role of 'staff'
    const staffMembers = await User.find({ role: "staff" });

    return NextResponse.json(
      {
        message: "Staff members retrieved successfully.",
        staff: staffMembers.map((user) => ({
            id: user._id,
            email: user.email,
            name: user.username,
            role: user.role,
            Service: user.services,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving staff members:", error);
    return NextResponse.json(
      { message: "Error retrieving staff members", error },
      { status: 500 }
    );
  }
}

// Other functions (DELETE, PUT) remain unchanged...
