import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import Appointment from "@/models/Appointment";

db(); // Establish a database connection

// Create or Update feedback and rating for an appointment
export async function PUT(request: NextRequest) {
  try {
    const { appointmentId, userId, feedback, rating } = await request.json();

    // Check if appointment ID and user ID are provided
    if (!appointmentId || !userId) {
      return NextResponse.json(
        { error: "Appointment ID and User ID are required." },
        { status: 400 }
      );
    }

    // Find the appointment to ensure it exists and belongs to the user
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      user: userId,
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found or does not belong to the user." },
        { status: 404 }
      );
    }

    // Update the feedback and rating for the appointment
    appointment.feedback = feedback;
    appointment.rating = rating;

    // Save the updated appointment
    await appointment.save();

    return NextResponse.json(appointment, { status: 200 });
  } catch (error) {
    console.error("Error while updating feedback and rating:", error);
    return NextResponse.json(
      { error: "Failed to update feedback and rating." },
      { status: 500 }
    );
  }
}

// Retrieve feedback and rating for an appointment by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("appointmentId");
    const userId = searchParams.get("userId");

    // Check if appointment ID and user ID are provided
    if (!appointmentId || !userId) {
      return NextResponse.json(
        { error: "Appointment ID and User ID are required." },
        { status: 400 }
      );
    }

    // Find the appointment by ID and ensure it belongs to the user
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      user: userId,
    }).select("feedback rating");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found or does not belong to the user." },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment, { status: 200 });
  } catch (error) {
    console.error("Error while fetching feedback and rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback and rating." },
      { status: 500 }
    );
  }
}

// Delete feedback and rating for an appointment
export async function DELETE(request: NextRequest) {
  try {
    const { appointmentId, userId } = await request.json();

    // Check if appointment ID and user ID are provided
    if (!appointmentId || !userId) {
      return NextResponse.json(
        { error: "Appointment ID and User ID are required." },
        { status: 400 }
      );
    }

    // Find the appointment to ensure it exists and belongs to the user
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      user: userId,
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found or does not belong to the user." },
        { status: 404 }
      );
    }

    // Update the feedback and rating to null
    appointment.feedback = null;
    appointment.rating = null;

    // Save the updated appointment
    await appointment.save();

    return NextResponse.json(
      { message: "Feedback and rating deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting feedback and rating:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback and rating." },
      { status: 500 }
    );
  }
}
