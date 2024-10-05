
import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import Reminder from "@/models/Reminder";
import jwt, { JwtPayload } from "jsonwebtoken";

// Connect to the database
db();

const verifyToken = (token: string | undefined): string => {
  if (!token) {
    throw new Error("No token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    return decoded.id; // Return user ID
  } catch (error) {
    throw new Error("Invalid or expired token", {cause: error});
  }
};

// Get all reminders for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const userId = verifyToken(token); 

    // Fetch all reminders associated with the user
    const reminders = await Reminder.find({ userId });

    return NextResponse.json(reminders, { status: 200 });
  } catch (error) {
    console.error("Error retrieving reminders:", error);
    return NextResponse.json(
      { message:  "Failed to fetch reminders." },
      { status: 500 }
    );
  }
}

// Create a new reminder
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const userId = verifyToken(token); // Get user ID from token

    const { title, date, message } = await request.json();

    // Validate input
    if (!title || !date || !message) {
      return NextResponse.json(
        { error: "Title, date, and message are required." },
        { status: 400 }
      );
    }

    const newReminder = new Reminder({
      title,
      date,
      message,
      userId, // Use userId from the decoded token
    });
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

// Update a reminder by ID
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const userId = verifyToken(token); // Get user ID from token

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
      { message:  "Failed to update reminder." },
      { status: 500 }
    );
  }
}

// Delete a reminder
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const userId = verifyToken(token); // Get user ID from token

    const { _id } = await request.json();

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
        { error: "You are not authorized to delete this reminder." },
        { status: 403 }
      );
    }

    await Reminder.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Reminder deleted." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json(
      { message:  "Failed to delete reminder." },
      { status: 500 }
    );
  }
}
