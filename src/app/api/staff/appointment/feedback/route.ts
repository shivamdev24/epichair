import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import Appointment from "@/models/Appointment";

db();
export async function PUT(request: NextRequest) {
  try {
    const { appointmentId, userId, feedback, rating } = await request.json();

    if (!appointmentId || !userId) {
      return NextResponse.json(
        { error: "Appointment ID and User ID are required." },
        { status: 400 }
      );
    }

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

    appointment.feedback = feedback;
    appointment.rating = rating;

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("appointmentId");
    const userId = searchParams.get("userId");

    if (!appointmentId || !userId) {
      return NextResponse.json(
        { error: "Appointment ID and User ID are required." },
        { status: 400 }
      );
    }

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

export async function DELETE(request: NextRequest) {
  try {
    const { appointmentId, userId } = await request.json();

    if (!appointmentId || !userId) {
      return NextResponse.json(
        { error: "Appointment ID and User ID are required." },
        { status: 400 }
      );
    }

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

    appointment.feedback = null;
    appointment.rating = null;

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
