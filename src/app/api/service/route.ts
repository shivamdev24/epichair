import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import Service from "@/models/Service";

import { verifyToken } from "@/utils/Token";

// Connect to the database
db();



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
