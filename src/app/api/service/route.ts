import { NextRequest, NextResponse } from "next/server";
import Service from "@/models/Service"; // Adjust the import as needed
import db from "@/utils/db"; // Ensure to connect to your database

db(); // Connect to the database

// Utility function to authenticate a request using JWT (optional)
import jwt from "jsonwebtoken";
const authenticateRequest = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    throw new Error("No token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token", { cause: error });

  }
};

// GET all services
export async function GET() {
  try {
    const services = await Service.find();
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving services", error},
      { status: 500 }
    );
  }
}

// POST a new service
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request if needed
    await authenticateRequest(request);

    const { name, description, price, duration } = await request.json();

    // Create a new service
    const newService = new Service({ name, description, price, duration });
    await newService.save();

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating service", error },
      { status: 500 }
    );
  }
}

// PUT to update a service
export async function PUT(request: NextRequest) {
  try {
    await authenticateRequest(request);

    const { id, name, description, price, duration } = await request.json();

    // Update the service
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, description, price, duration },
      { new: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating service", error },
      { status: 500 }
    );
  }
}

// DELETE a service
export async function DELETE(request: NextRequest) {
  try {
    await authenticateRequest(request);

    const { id } = await request.json();

    // Delete the service
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );

    }

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting service", error },
      { status: 500 }
    );
  }
}
