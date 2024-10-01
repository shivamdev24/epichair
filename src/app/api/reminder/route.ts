// src/app/api/reminders/route.ts

/* eslint-disable @typescript-eslint/no-unused-vars */


import { NextRequest, NextResponse } from "next/server";
import Reminder from "@/models/Reminder";
import db from "@/utils/db";

// Establish a database connection
db();

// Retrieve all reminders
export async function GET(request: NextRequest) {
  try {
    const reminders = await Reminder.find();
    return NextResponse.json(reminders, { status: 200 });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json(
      { error: "Failed to fetch reminders." },
      { status: 500 }
    );
  }
}

// Create a new reminder
export async function POST(request: NextRequest) {
  try {
    const { title, date, message } = await request.json();

    // Check for missing fields
    if (!title || !date || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const newReminder = new Reminder({ title, date, message });
    await newReminder.save();
    return NextResponse.json(newReminder, { status: 201 });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { error: "Failed to create reminder." },
      { status: 500 }
    );
  }
}

// Update an existing reminder
export async function PUT(request: NextRequest) {
  try {
    const { _id, title, date, message } = await request.json();

    // Check if _id is provided
    if (!_id) {
      return NextResponse.json(
        { error: "Reminder ID is required." },
        { status: 400 }
      );
    }

    const updatedReminder = await Reminder.findByIdAndUpdate(
      _id,
      { title, date, message },
      { new: true }
    );

    if (!updatedReminder) {
      return NextResponse.json(
        { error: "Reminder not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedReminder, { status: 200 });
  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json(
      { error: "Failed to update reminder." },
      { status: 500 }
    );
  }
}

// Delete a reminder
export async function DELETE(request: NextRequest) {
  try {
    const { _id } = await request.json();

    // Check if _id is provided
    if (!_id) {
      return NextResponse.json(
        { error: "Reminder ID is required." },
        { status: 400 }
      );
    }

    const deletedReminder = await Reminder.findByIdAndDelete(_id);
    if (!deletedReminder) {
      return NextResponse.json(
        { error: "Reminder not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Reminder deleted." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json(
      { error: "Failed to delete reminder." },
      { status: 500 }
    );
  }
}
