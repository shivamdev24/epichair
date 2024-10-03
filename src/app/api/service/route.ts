import { NextRequest, NextResponse } from "next/server";
import Service from "@/models/Service";
import db from "@/utils/db";
import jwt from "jsonwebtoken";

db();

const authenticateRequest = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    throw new Error("No token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid token");
  }
};


export async function GET() {
  try {
    const services = await Service.find();
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving services", error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticateRequest(request);

    const { name, description, price, duration } = await request.json();

    if (!name || !description || !price || !duration) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

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

export async function PUT(request: NextRequest) {
  try {
    await authenticateRequest(request);

    const { id, name, description, price, duration } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Service ID is required" },
        { status: 400 }
      );
    }

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

export async function DELETE(request: NextRequest) {
  try {
    await authenticateRequest(request);

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Service ID is required" },
        { status: 400 }
      );
    }

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
