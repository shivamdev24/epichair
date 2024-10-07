import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import Service from "@/models/Service";
import jwt, { JwtPayload } from "jsonwebtoken";

// Connect to the database
db();

const verifyToken = (request: NextRequest) => {
  
  let token: string | null = null;

  
  token = request.cookies.get("token")?.value || null;

  if (!token) {
    throw new Error("Authorization token is required.");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET || "default_secret_key"
    );

    if (typeof decoded !== "string" && (decoded as JwtPayload).id) {
      return (decoded as JwtPayload).id;
    } else {
      throw new Error("Invalid token payload.");
    }
  } catch (error) {
    throw new Error("Invalid token.", { cause: error });
  }
};

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);

    // Check if user is authenticated and is an admin
    if (!user) {
      return NextResponse.json(
        { message: "Authorization required to create a service." },
        { status: 401 }
      );
    }
    const services = await Service.find(); // Fetch all services
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { message: "Failed to fetch services." },
      { status: 500 }
    );
  }
}
