// // src/app/api/reminders/route.ts

// /* eslint-disable @typescript-eslint/no-unused-vars */



// import { NextRequest, NextResponse } from "next/server";
// import Reminder from "@/models/Reminder";
// import db from "@/utils/db";

// db();

// // export async function GET() {

// //   const reminders = await Reminder.find();
// //   return NextResponse.json(reminders, { status: 200 });
// // }

// export async function POST(request: NextRequest) {
//   const {  title, date, message } = await request.json();

//   const newreminder = new Reminder({ title, date, message });
//   await newreminder.save();
//   return NextResponse.json(newreminder, { status: 201 });
// }

// // export async function PUT(request: NextRequest) {
// //   const { _id, title, date, message } = await request.json();

// //   const reminder = await Reminder.findByIdAndUpdate(
// //     _id,
// //     { title, date, message },
// //     { new: true }
// //   );
// //   return NextResponse.json(reminder, { status: 200 });
// // }

// export async function DELETE(request: NextRequest) {
//   const { _id } = await request.json();

//   await Reminder.findByIdAndDelete(_id);
//   return NextResponse.json({ message: "Reminder deleted." }, { status: 200 });
// }





import { NextRequest, NextResponse } from "next/server";
import Reminder from "@/models/Reminder";
import db from "@/utils/db";

db();




export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    

    // Process the reminder creation
    const { title, date, message } = await request.json();
    const newReminder = new Reminder({ title, date, message });
    await newReminder.save();
    return NextResponse.json(newReminder, { status: 201 });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate the request
   

    // Process the reminder deletion
    const { _id } = await request.json();
    await Reminder.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Reminder deleted." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json({ error }, { status: 401 });
  }
}
