// Import necessary modules
import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import Appointment from "@/models/Appointment";
import { verifyToken } from "@/utils/Token";

// Connect to the database
db();


// Fetch a specific appointment by ID
export async function GET(request: NextRequest) {
  try {
    // Verify user token
    const user = verifyToken(request);
    console.log(user);

    // Check if user is authenticated and is an admin
    if (!user ) {
      return NextResponse.json(
        { message: "Authorization required to GET an appointment." },
        { status: 401 }
      );
    }

    // Get appointment ID from the URL parameters
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("id");

    // Check if appointment ID is provided
    if (!appointmentId) {
      return NextResponse.json(
        { message: "Appointment ID is required." },
        { status: 400 }
      );
    }

    // Fetch the specific appointment from the database
    const appointment = await Appointment.findById(appointmentId)
      .populate("barber") // Populate barber details
      .populate("user"); // Populate user details

    // Check if appointment was found
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    // Return the specific appointment details
    return NextResponse.json(appointment, { status: 200 });
  } catch (error) {
    console.error("Error while fetching the appointment:", error);
    return NextResponse.json(
      { message: "Failed to fetch the appointment." },
      { status: 500 }
    );
  }
}




