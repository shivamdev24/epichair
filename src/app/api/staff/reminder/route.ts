

import { NextRequest, NextResponse } from "next/server";
import Reminder from "@/models/Reminder";
import db from "@/utils/db";
import { verifyToken } from "@/utils/Token";

db();


export async function GET(request: NextRequest) {
  try {
    
    const userId = verifyToken(request);

    // Fetch all reminders associated with the user
    const reminders = await Reminder.find({ userId });

    return NextResponse.json(reminders, { status: 200 });
  } catch (error) {
    console.error("Error retrieving reminders:", error);
    return NextResponse.json(
      { message: "Failed to fetch reminders." },
      { status: 500 }
    );
  }
}

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

export async function PUT(request: NextRequest) {
  try {
    const userId = verifyToken(request); // Get user ID from token

    const { _id, title, date, message } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { error: "Reminder ID is required." },
        { status: 400 }
      );
    }

    const reminder = await Reminder.findById(_id);
    if (!reminder) {
      return NextResponse.json(
        { error: "Reminder not found." },
        { status: 404 }
      );
    }

    // Ensure the reminder belongs to the user
    if (reminder.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this reminder." },
        { status: 403 }
      );
    }

    // Update reminder fields
    if (title) reminder.title = title;
    if (date) reminder.date = date;
    if (message) reminder.message = message;

    await reminder.save(); // Save updated reminder

    return NextResponse.json(reminder, { status: 200 });
  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json(
      { message: "Failed to update reminder." },
      { status: 500 }
    );
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
