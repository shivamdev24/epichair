// src/app/api/reminders/route.ts
import { NextRequest, NextResponse } from "next/server";
import Reminder from "@/models/Reminder";
import db from "@/utils/db";

db();

export async function GET(request: NextRequest) {
   // Assuming you pass userId as a query parameter

  const reminders = await Reminder.find();
  return NextResponse.json(reminders, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { _id, title, date, message } = await request.json();

  const reminder = new Reminder.findById({ _id });
  const newreminder = new Reminder.reminder({ title, date, message });
  await newreminder.save();
  return NextResponse.json(newreminder, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { _id, title, date, message } = await request.json();

  const reminder = await Reminder.findByIdAndUpdate(
    _id,
    { title, date, message },
    { new: true }
  );
  return NextResponse.json(reminder, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const { _id } = await request.json();

  await Reminder.findByIdAndDelete(_id);
  return NextResponse.json({ message: "Reminder deleted." }, { status: 200 });
}
