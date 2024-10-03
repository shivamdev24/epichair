


import { NextRequest, NextResponse } from "next/server";
import Reminder from "@/models/Reminder";
import db from "@/utils/db";

db();




export async function POST(request: NextRequest) {
  try {
    
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
    
    const { _id } = await request.json();
    await Reminder.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Reminder deleted." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json({ error }, { status: 401 });
  }
}
