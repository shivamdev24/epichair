// src/app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import Appointment from "@/models/Appointment";

db(); 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Request Body:", body); 

    const { barber, user, service, appointmentDate, appointmentTime, status } =
      body;

    if (!barber || !user || !service || !appointmentDate || !appointmentTime) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const newAppointment = new Appointment({
      barber,
      user,
      service,
      appointmentDate,
      appointmentTime,
      status,
    });
    await newAppointment.save();

    console.log("Appointment saved:", newAppointment); 
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Error while creating appointment:", error); 
    return NextResponse.json(
      { error: "Failed to create appointment." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
   
    const userId = request.headers.get("user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }

    const appointments = await Appointment.find({ user: userId })
      .populate("barber")
      .populate("user");

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error while fetching appointments:", error); 
    return NextResponse.json(
      { error: "Failed to fetch appointments." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      _id,
      barber,
      user,
      service,
      appointmentDate,
      appointmentTime,
      status,
    } = await request.json();

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      _id,
      { barber, user, service, appointmentDate, appointmentTime, status },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error while updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { _id } = await request.json();

    const deletedAppointment = await Appointment.findByIdAndDelete(_id);
    if (!deletedAppointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Appointment deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting appointment:", error); 
    return NextResponse.json(
      { error: "Failed to delete appointment." },
      { status: 500 }
    );
  }
}
