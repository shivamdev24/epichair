import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import db from "@/utils/db";
import { verifyToken } from "@/utils/Token";
import Appointment from "@/models/Appointment";

db();



// GET all staff members
export async function GET(request: NextRequest) {
  try {
    verifyToken(request); // Ensure the token is verified

    // Retrieve all users with a role of 'staff'
    const staffMembers = await User.find({ role: "staff" });



     const staffWithAppointments = await Promise.all(
       staffMembers.map(async (staff) => {
         const appointments = await Appointment.find({ barber: staff._id }); // Fetch appointments for this staff
         return {
           _id: staff._id,
           name: staff.name, // Assuming 'name' is a field in the User model
           email: staff.email, // Assuming 'email' is a field in the User model
           phone: staff.phone, // Assuming 'phone' is a field in the User model (if applicable)
           role: staff.role, // Role of the staff member
           appointments: appointments.map((appt) => ({
             _id: appt._id,
             service: appt.service,
             appointmentDate: appt.appointmentDate,
             appointmentTime: appt.appointmentTime,
             status: appt.status,
           })), // Structure appointment details
         };
       })
     );


    return NextResponse.json(
      {
        message: "Staff members retrieved successfully.",
        staffWithAppointments,
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
