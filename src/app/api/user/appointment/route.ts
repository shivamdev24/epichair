

import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import Appointment from "@/models/Appointment";
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
    console.warn("No authorization token found."); 
    return null;
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
    console.error("Token verification error:", {cause: error}); 
    return null;
  }
};

// created by user
export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request);
    console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { message: "Authorization required to GET an appointment." },
        { status: 401 }
      );
    }



    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("id");

    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId)
        .populate("barber")
        .populate("user");

      if (!appointment) {
        return NextResponse.json(
          { error: "Appointment not found." },
          { status: 404 }
        );
      }

      return NextResponse.json(appointment, { status: 200 });
    } else {
      const appointments = await Appointment.find()
        .populate("barber")
        .populate("user");

      return NextResponse.json(appointments, { status: 200 });
    }
  } catch (error) {
    console.error("Error while fetching appointments:", error);
    return NextResponse.json(
      { message: "Failed to fetch appointments." },
      { status: 500 }
    );
  }
}

// Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const { service, appointmentDate, appointmentTime, barber, user } =
      await request.json();

    const userId = verifyToken(request);
    console.log(userId)

    if(!userId){
       return NextResponse.json(
         { message: "Authorization required to create an appointment." },
         { status: 401 }
       );
    }

    const newAppointment = new Appointment({
      barber, user,
      service,
      appointmentDate,
      appointmentTime,
    });

    await newAppointment.save();
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Error while creating appointment:", error);
    return NextResponse.json(
      { message: "Failed to create appointment." },
      { status: 500 }
    );
  }
}

// Update an appointment status pending to cancle by user using ID 
export async function PUT(request: NextRequest) {
  try {
    const { _id, status, service, appointmentDate, appointmentTime } =
      await request.json();
   const userId = verifyToken(request);
   console.log(userId);

   if (!userId) {
     return NextResponse.json(
       { message: "Authorization required to Update an appointment." },
       { status: 401 }
     );
   }

    const appointment = await Appointment.findById(_id);
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      _id,
      { status, service, appointmentDate, appointmentTime },
      { new: true }
    );
    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error while updating appointment:", error);
    return NextResponse.json(
      { message: "Failed to update appointment." },
      { status: 500 }
    );
  }
}

// Delete an appointment by ID
export async function DELETE(request: NextRequest) {
  try {
    const { _id } = await request.json();
   const userId = verifyToken(request);
   console.log(userId);

   if (!userId) {
     return NextResponse.json(
       { message: "Authorization required to Delete an appointment." },
       { status: 401 }
     );
   }
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
      { message: "Failed to delete appointment." },
      { status: 500 }
    );
  }
}
