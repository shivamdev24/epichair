import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import Appointment from "@/models/Appointment";
import { verifyToken } from "@/utils/Token";

db();



export async function GET(request: NextRequest) {
  try {
    // Verify token and get the user ID
    const TokenPayLoad = verifyToken(request);
    const userId = TokenPayLoad.id;
    console.log("User ID from token:", userId);

    if (!userId) {
      return NextResponse.json(
        { message: "Authorization required to fetch appointments." },
        { status: 401 }
      );
    }

    // Fetch all appointments for the logged-in user
    const appointments = await Appointment.find({ user: userId })
      .populate("barber") // Populate barber information if needed
      .populate("service") // Populate barber information if needed
      .populate("user"); // Populate user information if needed

    if (!appointments || appointments.length === 0) {
      return NextResponse.json(
        { message: "No appointments found for this user." },
        { status: 404 }
      );
    }

    // Return the appointments for the logged-in user
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error while fetching appointments:", error);
    return NextResponse.json(
      { message: "Failed to fetch appointments." },
      { status: 500 }
    );
  }
}



// Update an appointment status pending to cancle by user using ID
export async function PUT(request: NextRequest) {
  try {
    const { _id, status, service, appointmentDate, appointmentTime } =
      await request.json();
      const TokenPayLoad = verifyToken(request);
      const userId = TokenPayLoad.id;
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
// export async function DELETE(request: NextRequest) {
//   try {
//     const { _id } = await request.json();
    
    
//     const TokenPayLoad = verifyToken(request);
//     const userId = TokenPayLoad.id;
//     console.log(userId);
//     if (!userId) {
//       return NextResponse.json(
//         { message: "Authorization required to Delete an appointment." },
//         { status: 401 }
//       );
//     }
//     const deletedAppointment = await Appointment.findByIdAndDelete(_id);
//     if (!deletedAppointment) {
//       return NextResponse.json(
//         { error: "Appointment not found." },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Appointment deleted successfully." },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error while deleting appointment:", error);
//     return NextResponse.json(
//       { message: "Failed to delete appointment." },
//       { status: 500 }
//     );
//   }
// }
