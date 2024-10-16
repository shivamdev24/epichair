

import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import Appointment from "@/models/Appointment";
import { verifyToken } from "@/utils/Token";
// import Service from "@/models/Service";
// import User from "@/models/User";


db(); 





export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request);
    console.log("User ID from token:", userId);

    if (!userId) {
      return NextResponse.json(
        { message: "Authorization required to fetch appointments." },
        { status: 401 }
      );
    }

    const appointments = await Appointment.find({ user: userId })
      .populate("barber") 
      .populate("service") 
      .populate("user"); 

    if (!appointments || appointments.length === 0) {
      return NextResponse.json(
        { message: "No appointments found for this user." },
        { status: 404 }
      );
    }

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
    const { service, appointmentDate, appointmentTime, barber } =
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
      barber,
      user: userId,
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








// export async function POST(request: NextRequest) {
//   try {
//     const { service, appointmentDate, appointmentTime, barberId } =
//       await request.json();

//     const userId = verifyToken(request);
//     if (!userId) {
//       return NextResponse.json(
//         { message: "Authorization required to create an appointment." },
//         { status: 401 }
//       );
//     }

//     const barber = await User.findById(barberId);
//     if (!barber) {
//       return NextResponse.json(
//         { message: "Barber not found." },
//         { status: 404 }
//       );
//     }

//     const serviceModel = await Service.findById(service);
//     if (!serviceModel) {
//       return NextResponse.json(
//         { message: "Service not found." },
//         { status: 404 }
//       );
//     }

//     const serviceDurationInMinutes = serviceModel.duration; 
//     // const endOfRequestedSlot = appointmentTime + serviceDurationInMinutes;
//     const existingAppointments = await Appointment.find({
//       barber: barberId,
//       appointmentDate,
      
//     });

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const convertTimeToMinutes = (time: any) => {
//       const [hours, minutes] = time.split(":").map(Number);
//       return hours * 60 + minutes;
//     };

//     const requestedTimeInMinutes = convertTimeToMinutes(appointmentTime);

//     if (existingAppointments.length > 0) {
//       let nextAvailableTime = requestedTimeInMinutes; 
//       let hasPending = false;

//       for (const appointment of existingAppointments) {
//         const appointmentTimeInMinutes = convertTimeToMinutes(
//           appointment.appointmentTime
//         );

//         if (appointment.status === "pending") {
//           hasPending = true;

//           nextAvailableTime = Math.max(
//             nextAvailableTime,
//             appointmentTimeInMinutes + serviceDurationInMinutes
//           );
//         } else if (appointment.status === "confirmed") {
          
//           nextAvailableTime = Math.max(
//             nextAvailableTime,
//             appointmentTimeInMinutes + serviceDurationInMinutes
//           );
//         } else if (appointment.status === "cancelled") {
          
//           continue;
//         }
//       }

//       // Convert nextAvailableTime back to "HH:MM" format for the response
//       const nextAvailableHour = Math.floor(nextAvailableTime / 60);
//       const nextAvailableMinute = nextAvailableTime % 60;
//       const formattedNextAvailableTime = `${String(nextAvailableHour).padStart(
//         2,
//         "0"
//       )}:${String(nextAvailableMinute).padStart(2, "0")}`;

//       // Build the response based on whether there are pending or confirmed appointments
//       if (hasPending) {
//         return NextResponse.json({
//           existingAppointments,
//           message:
//             "There is a pending appointment at the selected time. Next available time:",
//           nextAvailableTime: formattedNextAvailableTime, 
//         });
//       } else {
//         return NextResponse.json({
//           existingAppointments,
//           message:
//             "There is a confirmed appointment at the selected time. Next available time:",
//           nextAvailableTime: formattedNextAvailableTime, 
//         });
//       }
//     }

//     const newAppointment = new Appointment({
//       barber: barberId,
//       user: userId,
//       service,
//       appointmentDate,
//       appointmentTime,
//     });

//     await newAppointment.save();
//     return NextResponse.json(
//       {
//         message: "Appointment created successfully",
//         appointment: newAppointment,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error while creating appointment:", error);
//     return NextResponse.json(
//       { message: "Failed to create appointment." },
//       { status: 500 }
//     );
//   }
// }




















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
      { status, service, appointmentDate ,appointmentTime},
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
