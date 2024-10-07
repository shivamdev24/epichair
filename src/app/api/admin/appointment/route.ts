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
    console.error("Token verification error:", { cause: error });
    return null;
  }
};




export async function GET(request: NextRequest) {
  try {
    // Verify user token
    const userId = verifyToken(request);
    console.log(userId);

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { message: "Authorization required to GET appointments." },
        { status: 401 }
      );
    }

    // Fetch all appointments from the database
    const appointments = await Appointment.find()
      .populate("barber") // Populate barber details
      .populate("user"); // Populate user details

    // Return the list of appointments
    return NextResponse.json(appointments, { status: 200 });
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
    const {
      service,
      appointmentDate,
      appointmentTime,
      barber,
      feedback,
      rating,
    } = await request.json();

    const userId = verifyToken(request);
    console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { message: "Authorization required to create an appointment." },
        { status: 401 }
      );
    }

    const newAppointment = new Appointment({
      barber,
      user: userId,
      service,
      appointmentDate,
      appointmentTime,
      appointmentType: "WalkIn", // Default value
      feedback,
      rating,
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


export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("id");

    // Ensure ID is present
    if (!_id) {
      return NextResponse.json(
        { message: "Appointment ID is required." },
        { status: 400 }
      );
    }

    const { status, service, appointmentDate, appointmentTime } =
      await request.json();

    const userId = verifyToken(request);
    console.log(userId);

    // Verify user authorization
    if (!userId) {
      return NextResponse.json(
        { message: "Authorization required to update an appointment." },
        { status: 401 }
      );
    }

    // Find the appointment by ID
    const appointment = await Appointment.findById(_id);
    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found." },
        { status: 404 }
      );
    }

    // Update the appointment with the provided data
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      _id,
      { status, service, appointmentDate, appointmentTime },
      { new: true }
    );

    // Return the updated appointment data
    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error while updating appointment:", error);
    return NextResponse.json(
      { message: "Failed to update appointment.", error }, // Include error message for debugging
      { status: 500 }
    );
  }
}

// Delete an appointment by ID
// export async function DELETE(request: NextRequest) {
//   try {
//     const { _id } = await request.json();
//     const userId = verifyToken(request);
//     console.log(userId);

//     if (!userId) {
//       return NextResponse.json(
//         { message: "Authorization required to delete an appointment." },
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




// Delete an appointment by ID
export async function DELETE(request: NextRequest) {
  try {
    // Extract appointment ID from the URL
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get('id'); // Assume appointment ID is passed as a query parameter

    // Validate the ID
    if (!(_id && typeof _id === 'string')) {
      return NextResponse.json(
        { message: "Invalid appointment ID." },
        { status: 400 }
      );
    }

    // Verify user token
    const userId = verifyToken(request);
    console.log('User ID:', userId);

    if (!userId) {
      return NextResponse.json(
        { message: "Authorization required to delete an appointment." },
        { status: 401 }
      );
    }

    // Attempt to delete the appointment
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
    
    // Handle unexpected errors
    return NextResponse.json(
      { message: "Failed to delete appointment." },
      { status: 500 }
    );
  }
}
